import suonXao from "../../assets/Header/suon-xao.jpg";
import gaRan from "../../assets/Header/ga-ran.jpg";
import banhMi from "../../assets/Header/banh-mi.jpg";
import thit from "../../assets/Header/thit.jpg";
import ca from "../../assets/Header/ca.jpg";
import haiSan from "../../assets/Header/hai-san.jpg";
import rau from "../../assets/Header/rau.jpg";
import dau from "../../assets/Header/dau.jpg";
import nam from "../../assets/Header/nam.jpg";
import banh from "../../assets/Header/banh.jpg";
import kem from "../../assets/Header/kem.jpg";
import traiCay from "../../assets/Header/trai-cay.jpg";
import nuocNgot from "../../assets/Header/nuoc-ngot.jpg";
import sinhTo from "../../assets/Header/sinh-to.jpg";
import traSua from "../../assets/Header/tra-sua.jpg";
import banhTrang from "../../assets/Header/banh-trang.jpg";
import khoaiTayChien from "../../assets/Header/khoai-tay-chien.jpg";
import vietNam from "../../assets/Header/viet-nam.jpg";
import trungQuoc from "../../assets/Header/trung-quoc.jpg";
import nhatBan from "../../assets/Header/nhat-ban.jpg";
import baiVietMoi from "../../assets/Header/bai-viet-moi.jpg";
import baiVietNoiBat from "../../assets/Header/bai-viet-noi-bat.jpg";
import baiVietPhoBien from "../../assets/Header/bai-viet-pho-bien.jpg";

const categories = [
  {
    name: "Món mặn",
    items: [
      { name: "Thịt", path: "/thit", src: thit },
      { name: "Cá", path: "/ca", src: ca },
      { name: "Hải sản", path: "/hai-san", src: haiSan },
    ],
  },
  {
    name: "Món chay",
    items: [
      { name: "Rau", path: "/rau", src: rau },
      { name: "Đậu", path: "/dau", src: dau },
      { name: "Nấm", path: "/nam", src: nam },
    ],
  },
  {
    name: "Tráng miệng",
    items: [
      { name: "Bánh", path: "/banh", src: banh },
      { name: "Kem", path: "/kem", src: kem },
      { name: "Trái cây", path: "/trai-cay", src: traiCay },
    ],
  },
  {
    name: "Đồ uống",
    items: [
      { name: "Nước ngọt", path: "/nuoc-ngot", src: nuocNgot },
      { name: "Sinh tố", path: "/sinh-to", src: sinhTo },
      { name: "Trà sữa", path: "/tra-sua", src: traSua },
    ],
  },
  {
    name: "Món ăn vặt",
    items: [
      { name: "Bánh tráng", path: "/banh-trang", src: banhTrang },
      { name: "Khoai tây chiên", path: "/khoai-tay-chien", src: khoaiTayChien },
      { name: "Bánh mì", path: "/banh-mi", src: banhMi },
    ],
  },
];

const search = [
  {
    name: "Công thức",
    items: [
      { name: "Sườn xào chua ngọt", path: "/suon-xao-chua-ngot", src: suonXao },
      { name: "Gà rán", path: "/ga-ran", src: gaRan },
      { name: "Bánh mì", path: "/banh-mi", src: banhMi },
    ],
  },
  {
    name: "Nguyên liệu",
    items: [
      { name: "Thịt", path: "/thit", src: thit },
      { name: "Cá", path: "/ca", src: ca },
      { name: "Hải sản", path: "/hai-san", src: haiSan },
    ],
  },
  {
    name: "Nền ẩm thực",
    items: [
      { name: "Việt Nam", path: "/vietnam", src: vietNam },
      { name: "Trung Quốc", path: "/trung-quoc", src: trungQuoc },
      { name: "Nhật Bản", path: "/nhat-ban", src: nhatBan },
    ],
  },
  {
    name: "Blog",
    items: [
      { name: "Bài viết mới", path: "/blog/bai-viet-moi", src: baiVietMoi },
      {
        name: "Bài viết nổi bật",
        path: "/blog/bai-viet-noi-bat",
        src: baiVietNoiBat,
      },
      {
        name: "Bài viết phổ biến",
        path: "/blog/bai-viet-pho-bien",
        src: baiVietPhoBien,
      },
    ],
  },

  {
    name: "Video",
    items: [
      { name: "Video mới", path: "/video-moi" },
      { name: "Video nổi bật", path: "/video-noi-bat" },
      { name: "Video phổ biến", path: "/video-pho-bien" },
    ],
  },
  {
    name: "Hình ảnh",
    items: [
      { name: "Hình ảnh mới", path: "/hinh-anh-moi" },
      { name: "Hình ảnh nổi bật", path: "/hinh-anh-noi-bat" },
      { name: "Hình ảnh phổ biến", path: "/hinh-anh-pho-bien" },
    ],
  },
];

const supports = [
  {
    name: "Điều kiện điều khoản",
    items: [
      { name: "Điều kiện", path: "/support/dieu-kien" },
      { name: "Điều khoản", path: "/support/dieu-khoan" },
    ],
  },
  {
    name: "Hướng dẫn sử dụng",
    items: [
      { name: "Hướng dẫn sử dụng", path: "/support/huong-dan" },
      { name: "Chức năng tiêu biểu", path: "/support/chuc-nang" },
    ],
  },
  {
    name: "Câu hỏi thường gặp",
    items: [
      { name: "Câu hỏi", path: "/support/cau-hoi" },
      { name: "Feedback", path: "/support/phan-hoi" },
    ],
  },
  {
    name: "Liên hệ",
    items: [
      { name: "Liên hệ", path: "/support/lien-he" },
      { name: "Hỗ trợ", path: "/support/ho-tro" },
    ],
  },
];

export { categories, search, supports };
