import SiteHeader from "@/components/site-header";

export default function Home() {
    return (
        <>
            <SiteHeader title="Home"/>
            <div className="h-full flex justify-center items-center">
                <div className="text-4xl font-bold">Home</div>
            </div>
        </>
        
    )
}