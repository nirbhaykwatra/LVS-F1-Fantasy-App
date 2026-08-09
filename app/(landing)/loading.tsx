import { AnimatedBackground } from "@/components/common/AnimatedBackground";

const LandingLoading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <AnimatedBackground />
            <div className="text-4xl font-bold text-white">Loading...</div>
        </div>
    );
};

export default LandingLoading;