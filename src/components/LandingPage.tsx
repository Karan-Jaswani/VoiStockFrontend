import React from "react";

export const LandingPage = () => {
    return (
        <div id="webcrumbs">
            <div className="w-full">
                <main>
                    <section className="relative h-[600px] md:h-[700px] lg:h-[600px] bg-gradient-to-r from-blue-900 to-gray-900">
                        <div className="absolute inset-0 bg-black/50"></div>
                        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-4 md:p-8">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center">
                                Streamline Your Business Operations
                            </h1>
                            <p className="text-lg md:text-xl mb-8 text-center max-w-2xl px-4">
                                Manage invoices, delivery challans, and inventory seamlessly with our comprehensive business
                                management solution
                            </p>
                            <a href="/signup">
                            <button className="bg-green-600 px-6 md:px-8 py-3 md:py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                                Get Started Now
                                </button></a>
                        </div>
                    </section>

                    <section className="py-16 md:py-20 px-4 md:px-8 lg:px-12 bg-gray-50">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">Our Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-green-600 mb-4">
                                    receipt_long
                                </span>
                                <h3 className="text-xl md:text-2xl font-semibold mb-4">Invoice Management</h3>
                                <p className="text-gray-600">
                                    Create and Manage invoices easily. Keep your billing organized and professional.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-green-600 mb-4">
                                    local_shipping
                                </span>
                                <h3 className="text-xl md:text-2xl font-semibold mb-4">Delivery Tracking</h3>
                                <p className="text-gray-600">
                                    Generate and Manage delivery challans. Keep a track of your shipments always.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-green-600 mb-4">
                                    inventory_2
                                </span>
                                <h3 className="text-xl md:text-2xl font-semibold mb-4">Inventory Control</h3>
                                <p className="text-gray-600">
                                    Monitor and manage your stock levels. Stay on top of your inventory.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="py-16 md:py-20 px-4 md:px-8 lg:px-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">Why Choose Us?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition-all duration-300">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-green-600 mb-4">speed</span>
                                <h3 className="text-lg md:text-xl font-semibold mb-2">Fast & Efficient</h3>
                                <p className="text-gray-600">Quick processing and real-time updates</p>
                            </div>

                            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition-all duration-300">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-green-600 mb-4">security</span>
                                <h3 className="text-lg md:text-xl font-semibold mb-2">Secure</h3>
                                <p className="text-gray-600">High-grade security measures</p>
                            </div>

                            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition-all duration-300">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-green-600 mb-4">
                                    analytics
                                </span>
                                <h3 className="text-lg md:text-xl font-semibold mb-2">Analytics</h3>
                                <p className="text-gray-600">Coming Soon!</p>
                            </div>

                            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition-all duration-300">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-green-600 mb-4">
                                    support_agent
                                </span>
                                <h3 className="text-lg md:text-xl font-semibold mb-2">24/7 Support</h3>
                                <p className="text-gray-600">Always here to help you.</p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};