import DashboardNav from "../components/DashboardNav"
import ButtonSignOut from "../components/ButtonSignOut"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUser } from "@/lib/actionsUsers";
import { stripe } from "@/lib/stripe";
import {prisma} from "@/lib/db";



export default async function DashboardLayout({children}: Readonly<{children: React.ReactNode}>) {

    const user = await getUser();

    if (!user) {
        return <div>Merci de vous connecter</div>
    }

    if(!user?.stripeCustomerId) {
        const stripeCustomer = await stripe.customers.create({
            email: user?.email as string,
        });

        await prisma.user.update({
            where: {id: user?.id as string},
            data: {
                stripeCustomerId: stripeCustomer.id as string,
            }
        })
    }




    return (
        <section className="flex justify-between items-center sm:items-start flex-col sm:flex-row w-9/12 mx-auto">

            <div className="w-1/6 flex justify-center my-10 ">
            <DashboardNav />  
            </div>

            <div className="w-5/6 mt-14">
                {children}
                <ToastContainer />
            </div>
        </section>
    )
}