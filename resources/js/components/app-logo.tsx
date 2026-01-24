import aulogo from "../../../public/assets/images/aulogo.png";

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center text-sidebar-primary-foreground">
                <img src={aulogo} alt="aulumni logo" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-2xl text-white">
                    aulumni
                </span>
            </div>
        </>
    );
}
