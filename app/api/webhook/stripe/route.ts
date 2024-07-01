import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: Request){
    const body = await req.text();
    const signature = headers().get("stripe-signature") as string;
    let event : Stripe.Event;
    try{
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
    }catch(error : unknown){
        return new Response("erreur webhook stripe", {status: 400});

    }
    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );
        const customerId = String(session.customer);

        const user = await prisma.user.findUnique({
            where: {stripeCustomerId: customerId},
        });

        if (!user) {
            throw new Error("User not found");
        }

        await prisma.subscription.create({
            data: {
                stripeSubscriptionId: subscription.id,
                userId: user.id,
                currentPeriodStart: subscription.current_period_start,
                currentPeriodEnd: subscription.current_period_end,
                status: subscription.status,
                planId: subscription.items.data[0].plan.id,
                interval: String(subscription.items.data[0].plan.interval),
            },
        });
    }

    if(event.type === "invoice.payment_succeeded"){
        const subscription= await stripe.subscriptions.retrieve(
            session.subscription as string
        );
        await prisma.subscription.update({
            where: {stripeSubscriptionId: subscription.id},
            data: {
                planId: subscription.items.data[0].plan.id,
                status: subscription.status,
                currentPeriodStart: subscription.current_period_start,
                currentPeriodEnd: subscription.current_period_end,
            },
        });
    }
    return new Response(null, {status: 200});
}