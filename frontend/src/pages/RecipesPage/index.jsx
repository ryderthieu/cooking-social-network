import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { Korea1 } from "../../assets/Recipe/images";
import BreadCrumb from "../../components/common/BreadCrumb";

export default function RecipeCategories() {
  const categories = {
    "meal-type": {
      title: "Loại bữa ăn",
      items: [
        {
          name: "Bữa sáng",
          description: "Bữa ăn đầu ngày giúp cung cấp năng lượng.",
        },
        {
          name: "Bữa trưa",
          description: "Bữa ăn chính giữa ngày, thường giàu dinh dưỡng.",
        },
        {
          name: "Bữa tối",
          description: "Bữa ăn cuối ngày, nên nhẹ nhàng và dễ tiêu.",
        },
        {
          name: "Bữa xế",
          description: "Bữa ăn nhẹ giữa chiều, giúp duy trì năng lượng.",
        },
        {
          name: "Món tráng miệng",
          description: "Món ăn ngọt dùng sau bữa chính.",
        },
      ],
      background: "bg-[#ffefd0]",
      color: "bg-[#FFD0A1]",
    },
    cuisine: {
      title: "Vùng ẩm thực",
      items: [
        {
          name: "Việt Nam",
          description: "Ẩm thực đa dạng với nước chấm và thảo mộc.",
        },
        {
          name: "Nhật Bản",
          description: "Tinh tế, chú trọng nguyên liệu tươi sống.",
        },
        {
          name: "Hàn Quốc",
          description: "Đậm đà với nhiều món lên men như kimchi.",
        },
        {
          name: "Trung Quốc",
          description: "Nhiều món xào, hấp, mang hương vị mạnh.",
        },
        {
          name: "Thái Lan",
          description: "Cay, chua, ngọt hài hòa với hương liệu phong phú.",
        },
        {
          name: "Ấn Độ",
          description: "Đặc trưng với gia vị đậm đà và món cà ri.",
        },
        {
          name: "Âu",
          description: "Tinh tế, thường kết hợp sốt kem và phô mai.",
        },
        {
          name: "Mỹ",
          description: "Phong phú, chịu ảnh hưởng nhiều nền ẩm thực.",
        },
        {
          name: "Mexico",
          description: "Món ăn cay, giàu năng lượng với phô mai và đậu.",
        },
      ],
      background: "bg-[#FFE9E9]",
      color: "bg-[#c98c8b4e]",
    },
    occasions: {
      title: "Dịp đặc biệt",
      items: [
        {
          name: "Tiệc tùng",
          description: "Món ăn phong phú để chia sẻ trong buổi tiệc.",
        },
        {
          name: "Sinh nhật",
          description: "Món ăn và bánh ngọt cho ngày đặc biệt.",
        },
        {
          name: "Ngày lễ Tết",
          description: "Món truyền thống mang ý nghĩa sum vầy.",
        },
        {
          name: "Ăn chay",
          description: "Món không chứa thịt, thanh đạm và tinh khiết.",
        },
        {
          name: "Món ăn ngày lạnh/nóng",
          description: "Phù hợp với thời tiết từng mùa.",
        },
      ],
      background: "bg-[#DFDFF2]",
      color: "bg-[#7762C150]",
    },
    dietary: {
      title: "Chế độ ăn",
      items: [
        {
          name: "Ăn chay",
          description: "Không ăn thịt, cá, sử dụng thực vật làm chính.",
        },
        {
          name: "Thuần chay",
          description: "Loại bỏ toàn bộ sản phẩm từ động vật.",
        },
        {
          name: "Keto/Low-carb",
          description: "Ít tinh bột, giàu chất béo và protein.",
        },
        {
          name: "Thực phẩm chức năng",
          description: "Hỗ trợ sức khỏe và bổ sung dinh dưỡng.",
        },
        {
          name: "Không gluten",
          description: "Phù hợp người dị ứng gluten trong lúa mì.",
        },
        {
          name: "Ăn kiêng giảm cân",
          description: "Giảm calo, hỗ trợ quá trình giảm cân.",
        },
      ],
      background: "bg-[#E9F0E2]",
      color: "bg-[#FFFFFF]",
    },
    "main-ingredients": {
      title: "Nguyên liệu chính",
      items: [
        {
          name: "Thịt gà",
          description: "Nguyên liệu phổ biến, ít béo và dễ nấu.",
        },
        {
          name: "Thịt bò",
          description: "Giàu sắt và protein, thích hợp món hầm, nướng.",
        },
        {
          name: "Thịt heo",
          description: "Mềm, dễ chế biến và có nhiều phần thịt ngon.",
        },
        {
          name: "Hải sản",
          description: "Tôm, cua, cá... giàu dinh dưỡng và đa dạng món.",
        },
        {
          name: "Trứng",
          description: "Nguồn protein rẻ, dễ kết hợp vào mọi bữa ăn.",
        },
        {
          name: "Rau củ",
          description: "Giàu chất xơ, vitamin, phù hợp món chay và mặn.",
        },
        {
          name: "Đậu phụ",
          description: "Thay thế thịt trong chế độ chay, giàu đạm thực vật.",
        },
      ],
      background: "bg-[#FEDAC8]",
      color: "bg-[#FFAD5660]",
    },
    "cooking-method": {
      title: "Phương pháp nấu",
      items: [
        { name: "Chiên", description: "Món ăn có lớp vỏ giòn, đậm đà." },
        {
          name: "Nướng",
          description: "Tăng hương vị với lửa trực tiếp hoặc lò.",
        },
        { name: "Hấp", description: "Giữ được chất dinh dưỡng, ít dầu mỡ." },
        {
          name: "Xào",
          description: "Nhanh, giữ độ giòn và màu sắc nguyên liệu.",
        },
        {
          name: "Luộc",
          description: "Đơn giản, giữ hương vị tự nhiên của nguyên liệu.",
        },
        { name: "Hầm", description: "Ninh lâu để món ăn mềm và đậm vị." },
        {
          name: "Nấu súp",
          description: "Lỏng, dễ tiêu, thích hợp khai vị hoặc món chính nhẹ.",
        },
      ],
      background: "bg-[#D1DEE2]",
      color: "bg-[#7AAFD650]",
    },
    utensils: {
      title: "Dụng cụ nấu",
      items: [
        {
          name: "Nồi chiên không dầu",
          description: "Nấu món chiên mà không cần dầu mỡ nhiều.",
        },
        {
          name: "Lò nướng",
          description: "Thích hợp cho bánh và món nướng giòn.",
        },
        {
          name: "Nồi nấu chậm",
          description: "Ninh lâu ở nhiệt độ thấp, giữ hương vị.",
        },
        {
          name: "Nồi áp suất",
          description: "Nấu nhanh các món cần thời gian lâu như hầm.",
        },
        {
          name: "Lò vi sóng",
          description: "Hâm nóng và chế biến nhanh các món ăn.",
        },
      ],
      background: "bg-[#FFE9FF]",
      color: "bg-[#E9A0C850]",
    },
  };

  const slugMap = {
    "Bữa sáng": "breakfast",
    "Bữa trưa": "lunch",
    "Bữa tối": "dinner",
    "Bữa xế": "snack",
    "Món tráng miệng": "dessert",

    "Việt Nam": "vietnamese",
    "Nhật Bản": "japanese",
    "Hàn Quốc": "korean",
    "Trung Quốc": "chinese",
    "Thái Lan": "thai",
    "Ấn Độ": "indian",
    Âu: "european",
    Mỹ: "american",
    Mexico: "mexican",

    "Tiệc tùng": "party",
    "Sinh nhật": "birthday",
    "Ngày lễ Tết": "holiday",
    "Ăn chay": "vegetarian",
    "Món ăn ngày lạnh/nóng": "weather-based",

    "Thuần chay": "vegan",
    "Keto/Low-carb": "keto",
    "Thực phẩm chức năng": "functional-food",
    "Không gluten": "gluten-free",
    "Ăn kiêng giảm cân": "diet",

    "Thịt gà": "chicken",
    "Thịt bò": "beef",
    "Thịt heo": "pork",
    "Hải sản": "seafood",
    Trứng: "egg",
    "Rau củ": "vegetables",
    "Đậu phụ": "tofu",

    Chiên: "fried",
    Nướng: "grilled",
    Hấp: "steamed",
    Xào: "stir-fried",
    Luộc: "boiled",
    Hầm: "braised",
    "Nấu súp": "soup",

    "Nồi chiên không dầu": "air-fryer",
    "Lò nướng": "oven",
    "Nồi nấu chậm": "slow-cooker",
    "Nồi áp suất": "pressure-cooker",
    "Lò vi sóng": "microwave",
  };

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getBannerStyles = () => {
    const maxScroll = 200; // Scroll 200px để hoàn thành animation
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    const width = 100 - scrollProgress * 15;
    const borderRadius = scrollProgress * 48;

    return {
      width: `${width}%`,
      borderRadius: `${borderRadius}px`,
      transition: "width 0.5s ease-out, border-radius 0.5s ease-out",
      margin: "0 auto",
    };
  };

  return (
    <MainLayout>
      <div className="mx-auto w-full">
        {/* Banner */}
        <div className="relative overflow-hidden" style={getBannerStyles()}>
          {/* Background */}
          <div className="w-full bg-gradient-to-tr from-[#fd3cb3] to-yellow-200 h-[400px]"></div>
          <div className="absolute inset-0 bg-opacity-30">
            <div className="p-10 h-full">
              <BreadCrumb />

              <div className="flex justify-center h-full">
                <h1 className="text-white text-3xl md:text-5xl text-center font-extrabold">
                  Khám phá công thức
                </h1>
                {/* Category finder */}
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-[90%] max-w-6xl">
                  <div className="bg-white/70 backdrop-blur-lg p-6 md:p-10 rounded-xl shadow-lg">
                    <h2 className="text-xl mb-4 font-semibold text-gray-800">
                      Tìm kiếm công thức theo danh mục
                    </h2>
                    <p className="mb-4 text-gray-700">
                      Chọn một trong các danh mục bên dưới để khám phá các công
                      thức phù hợp với nhu cầu của bạn.
                    </p>
                    <nav className="flex flex-wrap gap-3">
                      {Object.entries(categories).map(([key, category]) => (
                        <a
                          key={key}
                          href={`#${key}`}
                          className="px-4 py-2 bg-white hover:bg-[#FF6363] hover:text-white rounded-full border border-gray-200 transition-colors duration-300 text-sm md:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6363] focus:ring-offset-2"
                          aria-label={`Chuyển đến danh mục ${category.title}`}
                        >
                          {category.title}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories section */}
        <main className="my-12 mx-4 lg:mx-[100px]">
          {Object.entries(categories).map(([categoryType, category]) => (
            <section
              key={categoryType}
              id={categoryType}
              className="rounded-lg p-6 scroll-mt-24 relative mb-8"
            >
              <h2 className="text-[24px] font-bold text-blue-950 mb-6">
                {category.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {category.items.map((item) => (
                  <Link
                    key={item.name}
                    to={`/recipes/${categoryType}/${
                      slugMap[item.name] || encodeURIComponent(item.name)
                    }`}
                    className={`relative flex w-full max-w-[300px] ${category.background} py-8 px-6 h-[120px] rounded-2xl shadow-lg shadow-gray-300 ring-2 ring-white/50 hover:-translate-y-2 transition-transform ease-in-out duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    aria-label={`Xem công thức ${item.name}`}
                  >
                    <div className="absolute right-6 bottom-3 rounded-full grid place-items-center size-[6em] shadow-lg border border-gray-100">
                      <img
                        src={Korea1}
                        alt={`Hình ảnh minh họa cho ${item.name}`}
                        className="w-[90%] h-[90%] object-cover rounded-full"
                      />
                    </div>
                    <div
                      className={`rounded-full size-12 ${category.color} absolute blur-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
                      aria-hidden="true"
                    ></div>
                    <div
                      className={`rounded-full size-8 ${category.color} absolute blur-lg bottom-0 right-0`}
                      aria-hidden="true"
                    ></div>
                    <div
                      className={`rounded-full size-8 ${category.color} absolute blur-lg bottom-8 left-0`}
                      aria-hidden="true"
                    ></div>
                    <span className="font-bold text-blue-950 max-w-[150px] text-xl z-10">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </MainLayout>
  );
}
