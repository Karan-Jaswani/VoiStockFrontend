
import React from "react";

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 text-white text-center p-4 m-0 mt-10">
            <p>&copy; {new Date().getFullYear()} BiteCodes. All Rights Reserved.</p>
        </footer>
    );
};
