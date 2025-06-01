import React from "react";
import Hero from "../../../components/sections/Support/Hero";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { HiBuildingOffice2 } from "react-icons/hi2";

const ContactsPage = () => {
  const contactInfo = [
    {
      title: "Email",
      icon: <MdEmail className="h-10 w-10" />,
      description: "chat@oshisha.com",
    },
    {
      title: "Số điện thoại",
      icon: <FaPhoneAlt className="h-10 w-10" />,
      description: "+84 8386 8386",
    },
    {
      title: "Chi nhánh 1",
      icon: <HiBuildingOffice2 className="h-10 w-10" />,
      description:
        "Lầu 5, Tòa nhà ABC Tower, 123 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh",
    },
    {
      title: "Chí nhánh 2",
      icon: <HiBuildingOffice2 className="h-10 w-10" />,
      description:
        "Tầng 7, Tòa nhà XYZ Plaza, 456 Phố Huế, Quận Hai Bà Trưng, Hà Nội",
    },
  ];

  return (
    <div>
      <Hero />
      <div className="mx-[120px] my-[60px]">
        <h2 className="text-2xl font-semibold mb-4">Cách thức liên hệ</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className="flex items-start p-4 border rounded-lg shadow-sm hover:shadow-md transition py-6"
            >
              <div className="text-3xl mx-6 my-auto">{item.icon}</div>
              <div className="my-auto">
                <h3 className="font-medium text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-semibold mb-4">Bản đồ</h2>
        <div className="w-full h-[350px] rounded overflow-hidden shadow-md">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.2632786173177!2d106.80059381474996!3d10.867975492248224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527f0ac5eb4e3%3A0xe55d5fa6e3c9bb97!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjhuqVwIFRow6BuaCBUaOG7pyBUaOG7pyBUaMO0bmcgLSDEkOG7k25nIEjhu5MgQ-G7kSAoVUlUKQ!5e0!3m2!1svi!2s!4v1716628026647!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
