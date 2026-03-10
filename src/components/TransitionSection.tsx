import { motion } from 'framer-motion';

export const TransitionSection = () => {
    return (
        <div className="w-full pt-32 pb-16 flex items-center justify-center bg-black relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-10%" }}
                className="max-w-4xl px-6 text-center">
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <h2 className="text-[2.2rem] leading-tight md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#f5f5f7] flex flex-col items-center">
                    {/* Desktop/Tablet view */}
                    <div className="hidden md:flex flex-col items-center">
                        <span>
                            The Band Ur <span style={{ color: '#bd7b7b' }}>girl</span> told <span style={{ color: '#7ba8bd' }}>U</span>
                        </span>
                        <span className="self-start -ml-4 md:-ml-8 lg:-ml-12 mt-2">
                            not to worry about
                        </span>
                    </div>
                    {/* Mobile view */}
                    <div className="flex md:hidden flex-col items-start text-left text-4xl">
                        <span>The Band Ur</span>
                        <span><span style={{ color: '#bd7b7b' }}>girl</span> told <span style={{ color: '#7ba8bd' }}>U</span></span>
                        <span>not to worry about</span>
                    </div>
                </h2>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
            </motion.div>
        </div>
    );
};
