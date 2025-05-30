import React from 'react';

export default function EmptyState({ icon, title, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border-0">
      <div className="p-12 text-center">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
}