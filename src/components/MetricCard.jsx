import React from 'react';

const MetricCard = ({ title, value, unit, icon }) => {
    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] flex items-center gap-4 transition-all hover:bg-white/10">
            <div className="text-2xl opacity-80">{icon}</div>
            <div>
                <p className="text-xs font-medium text-white/40 uppercase tracking-widest">{title}</p>
                <p className="text-xl font-semibold text-white">{value} <span className="text-sm font-normal text-white/40">{unit}</span></p>
            </div>
        </div>
    );
};

export default MetricCard;