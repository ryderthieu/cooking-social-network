import React from "react";
import TrungThu from '../../../assets/Recipe/trungthu.png'

const RecipeHeader = ({
  scrollY,
  displayCategoryName,
  displayItemName,
  categoryDescription,
  categoryType,
  currentCategory,
}) => {
  // Hệ thống màu sắc theo loại category
  const getCategoryColors = (type) => {
    const colorSchemes = {
      mealType: {
        background: "#FFEDC1",
        wavyShape: "#F6A707",
        dropShadow: "#F6A70720",
        ellipse: "#F6A707",
      },
      cuisine: {
        background: "#FCD3D5",
        wavyShape: "#DF5C63",
        dropShadow: "#DF5C6320",
        ellipse: "#DF5C63",
      },
      occasions: {
        background: "#E3CAE7",
        wavyShape: "#874290",
        dropShadow: "#87429020",
        ellipse: "#874290",
      },
      dietaryPreferences: {
        background: "#EFF8CF",
        wavyShape: "#A2BB40",
        dropShadow: "#A2BB4020",
        ellipse: "#A2BB40",
      },
      mainIngredients: {
        background: "#F2E4DB",
        wavyShape: "#A36A4E",
        dropShadow: "#A36A4E20",
        ellipse: "#A36A4E",
      },
      cookingMethod: {
        background: "#9dcbde",
        wavyShape: "#16495e",
        dropShadow: "#16495e20",
        ellipse: "#16495e",
      },
    };

    return colorSchemes[type] || colorSchemes.mealType;
  };

  // Hệ thống hình decorative theo loại category
  const getDecorativeImages = (type) => {
    const decorativeSchemes = {
      mealType: [
        {
          src: "https://static.vecteezy.com/system/resources/previews/026/691/112/large_2x/coffee-cup-art-collection-ai-generated-free-png.png",
          alt: "Bread",
          className: "absolute top-0 right-[48px] w-[180px] rotate-[10deg] z-20",
        },
        {
          src: "https://banhmiaqua.com/assets/bread-6e334888.png",
          alt: "Coffee",
          className: "absolute bottom-5 right-[30%] w-[200px] z-20",
          style: { transform: "translateX(-50%)" },
        },
        {
          src: "https://cdn.pixabay.com/photo/2023/07/27/04/20/vietnamese-8152418_960_720.png",
          alt: "Egg",
          className: "absolute top-20 right-[35%] w-[180px] z-20",
          style: { transform: "translateX(-50%)" },
        },
      ],
      cuisine: [
        {
          src: "https://png.pngtree.com/png-clipart/20231114/original/pngtree-pizza-slice-png-image_13541107.png",
          alt: "Pizza",
          className: "absolute top-5 right-[50px] w-[150px] z-20",
        },
        {
          src: "https://static.vecteezy.com/system/resources/previews/040/209/568/non_2x/ai-generated-sushi-clip-art-free-png.png",
          alt: "Sushi",
          className: "absolute bottom-2 right-[30%] w-[180px] z-20",
          style: { transform: "translateX(-50%)" },
        },
        {
          src: "https://static.vecteezy.com/system/resources/previews/026/158/964/original/mexican-food-tacos-taco-with-meat-vegetables-delicious-taco-generative-ai-png.png",
          alt: "Taco",
          className: "absolute top-[30px] right-[30%] w-[280px] z-20",
          style: { transform: "translateX(-50%)" },
        },
      ],
      occasions: [
        {
          src: "https://png.pngtree.com/png-clipart/20231003/original/pngtree-birthday-cake-pink-cute-cartoon-3d-png-image_13249055.png",
          alt: "Birthday Cake",
          className: "absolute top-10 right-[64px] w-[120px] rotate-[20deg] z-20",
        },
        {
          src: "https://png.pngtree.com/png-clipart/20211227/original/pngtree-happy-new-year-traditional-vietnamese-chung-cakes-png-png-image_6989136.png",
          alt: "Cupcake",
          className: "absolute bottom-0 right-[28%] w-[190px] z-20",
          style: { transform: "translateX(-50%)" },
        },        {
          src: TrungThu,
          alt: "Gift",
          className: "absolute top-20 right-[32%] w-[250px] z-20",
          style: { transform: "translateX(-50%)" },
        },
      ],
      dietaryPreferences: [
        {
          src: "https://www.pngall.com/wp-content/uploads/2/Blueberry-PNG-Photo.png",
          alt: "Salad",
          className: "absolute top-10 right-[64px] w-[120px] z-20",
        },
        {
          src: "https://th.bing.com/th/id/R.1131efd1323188acb3375c4690afdf98?rik=%2f%2fvlj3BMWcnXLA&pid=ImgRaw&r=0",
          alt: "Avocado",
          className: "absolute bottom-0 right-[30%] w-[200px] z-20",
          style: { transform: "translateX(-50%)" },
        },
        {
          src: "https://pngimg.com/d/strawberry_PNG2637.png",
          alt: "Broccoli",
          className: "absolute top-20 right-[40%] w-[130px] z-20",
          style: { transform: "translateX(-50%)" },
        },
      ],
      mainIngredients: [
        {
          src: "",
          alt: "",
          className: "absolute top-10 right-[64px] w-[120px] z-20",
        },
        {
          src: "",
          alt: "",
          className: "absolute bottom-10 right-1/3 w-[130px] z-20",
          style: { transform: "translateX(-50%)" },
        },
        {
          src: "",
          alt: "",
          className: "absolute top-20 right-[40%] w-[100px] z-20",
          style: { transform: "translateX(-50%)" },
        },
      ],
      cookingMethod: [
        {
          src: "https://khothietke.net/wp-content/uploads/2021/05/PNGkhothietke.net-02839.png",
          alt: "Frying Pan",
          className: "absolute top-10 right-[64px] w-[120px] z-20",
        },
        {
          src: "https://khothietke.net/wp-content/uploads/2021/05/PNGkhothietke.net-02847.png",
          alt: "Pot",
          className: "absolute bottom-10 right-1/3 w-[150px] z-20",
          style: { transform: "translateX(-50%)" },
        },
        {
          src: "https://th.bing.com/th/id/R.2a59f51ef57f11177639dfba6b3370f7?rik=bhx1UHxGUpMD4Q&pid=ImgRaw&r=0",
          alt: "Oven",
          className: "absolute top-20 right-[40%] w-[150px] z-20",
          style: { transform: "translateX(-50%)" },
        },
      ],
    };

    return decorativeSchemes[type] || decorativeSchemes.mealType;
  };

  const colors = getCategoryColors(categoryType);
  const decorativeImages = getDecorativeImages(categoryType);
  const getBannerStyles = () => {
    const maxScroll = 200;
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
    <div
      className="relative h-[580px] overflow-hidden mt-4"
      style={getBannerStyles()}
    >
      {/* Gradient background layers */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: colors.background }}
      ></div>{" "}
      {/* Decorative images based on category type */}
      {decorativeImages.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={image.alt}
          className={image.className}
          style={image.style}
        />
      ))}
      {/* Main content */}
      <div className="relative z-30 flex flex-row items-center justify-between h-full pl-[110px]">
        {/* Left text section */}
        <div className="max-w-[420px]">
          <h1 className="text-white text-5xl font-bold mb-8 flex items-center gap-2">
            {displayItemName.toUpperCase()}
          </h1>
          <p
            className={`text-white/90 text-lg text-[${colors.background}] leading-relaxed mb-8`}
          >
            {categoryDescription}
          </p>
        </div>

        {/* Right smoothie bowl */}
        <div className="relative flex mr-[160px]">
          {currentCategory?.image && (
            <img
              src={currentCategory.image}
              alt={displayItemName}
              className="w-[400px] h-[400px] rounded-full shadow-2xl object-cover border-[16px] border-[#fffae9]"
            />
          )}
        </div>
      </div>
      {/* Big wavy shape top-left */}
      <div className="absolute -top-10 -left-5 z-0 pointer-events-none w-full h-full">
        <svg
          width="833"
          height="556"
          viewBox="0 0 833 556"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: `drop-shadow(0 8px 32px ${colors.dropShadow})` }}
        >
          <g filter="url(#filter0_d_66_4)">
            <path
              d="M0 539.311L1.23565 485.838C1.23565 485.838 0 575.741 0 539.311Z"
              fill={colors.wavyShape}
              fillOpacity="0.85"
            />
            <path
              d="M1.23545 0H644.343C644.343 0 858.4 69.2099 825.577 205.309C792.755 341.408 691.334 281.114 631.722 281.114C572.11 281.114 521.615 346.743 596.12 378.892C670.626 411.042 602.744 568.339 516.638 503.407C430.532 438.476 439.639 558.408 286.469 476.671C133.3 394.934 200.363 507.227 134.127 476.671C67.8915 446.115 60.44 550.769 0 539.311L1.23545 0Z"
              fill={colors.wavyShape}
              fillOpacity="0.85"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_66_4"
              x="-4"
              y="0"
              width="837"
              height="556"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_66_4"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_66_4"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>
      {/* Bottom ellipse */}
      <div className="absolute -bottom-[120px] -right-[100px]">
        <svg
          width="512"
          height="405"
          viewBox="0 0 512 405"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_69_2)">
            <ellipse
              cx="305.5"
              cy="299"
              rx="296.5"
              ry="290"
              fill={colors.ellipse}
            />
          </g>
          <defs>
            <filter
              id="filter0_d_69_2"
              x="0"
              y="0"
              width="603"
              height="590"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="-4" dy="-4" />
              <feGaussianBlur stdDeviation="2.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_69_2"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_69_2"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default RecipeHeader;
