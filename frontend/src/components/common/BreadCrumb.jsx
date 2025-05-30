import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function BreadCrumb() {
  const location = useLocation();
  
  // Tạo mảng breadcrumb từ URL
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  // Mapping tên hiển thị cho các route
  const routeNames = {
    'recipes': 'Khám phá công thức',
    'profile': 'Hồ sơ',
    'about': 'Về chúng tôi',
    'contact': 'Liên hệ',
    'saved': 'Công thức đã lưu',
    'breakfast': 'Bữa sáng',
    'lunch': 'Bữa trưa',
    'dinner': 'Bữa tối',
    'meal-type': "Loại bữa ăn",
    'create': "Tạo công thức"
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-white mb-4">
      {/* Trang chủ */}
      <Link 
        to="/" 
        className="hover:text-pink-600 font-bold underline text-lg transition-colors"
      >
        Trang chủ
      </Link>
      
      {/* Các breadcrumb items */}
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNames[name] || decodeURIComponent(name);
        
        return (
          <React.Fragment key={name}>
            <span className="text-white font-bold text-lg ">{'>'}</span>
            {isLast ? (
              <span className="text-slate-800 text-lg font-bold">
                {displayName}
              </span>
            ) : (
              <Link 
                to={routeTo} 
                className="hover:text-pink-600 underline font-bold text-lg transition-colors"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}