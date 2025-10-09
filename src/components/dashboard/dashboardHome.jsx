import React from "react";
import fa from "../../locales/fa.json";

const t = fa.panel.dashboard;

export default function DashboardHome() {
    return (
        <div dir="rtl" className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{t.title}</h1>
            <p className="text-gray-600">{t.welcome}</p>
        </div>
    );
}
