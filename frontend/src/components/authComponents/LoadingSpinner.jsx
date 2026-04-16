import { motion } from "framer-motion";
import AuthLayout from "./AuthLayout";

const LoadingSpinner = () => {
	return (
    <AuthLayout>
		<div >
			{/* Simple Loading Spinner */}
			<motion.div
				className='w-16 h-16 border-4 border-t-4 border-t-gray-300 border-blue-500/40 rounded-full'
				animate={{ rotate: 360 }}
				transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
			/>
		</div>
    </AuthLayout>
	);
};

export default LoadingSpinner;