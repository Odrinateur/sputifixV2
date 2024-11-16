import {Card} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import {House, Settings} from "lucide-react";

export default function Navbar() {
    return <nav className={"w-full lg:w-1/5 flex flex-col gap-10 justify-start"}>
        <Card
            className={"w-full flex flex-col sm:flex-row lg:flex-col p-4 gap-2 justify-start sm:justify-center lg:justify-start"}>
            <Button variant="link" className={"text-2xl"}>
                <House className={"!w-6 !h-6"}/>
                <Link to={"/"}>
                    Home
                </Link>
            </Button>
            <Button variant="link" className={"text-2xl"}>
                <Settings className={"!w-6 !h-6"}/>
                <Link to={"/settings"}>
                    Settings
                </Link>
            </Button>
        </Card>
    </nav>
}