import text from "@/assets/videos/cdielts-text.mp4";
import kirish from "@/assets/videos/cdielts-kirish.mp4";
import partlar from "@/assets/videos/cdielts-partlar.mp4";
import javoblar from "@/assets/videos/cdielts-javoblar.mp4";
import flowchart from "@/assets/videos/cdielts-flowchart.mp4";
import radioGroup from "@/assets/videos/cdielts-radio-group.mp4";
import testgaKirish from "@/assets/videos/cdielts-testga-kirish.mp4";
import modulVaqtlari from "@/assets/videos/cdielts-modul-vaqtlari.mp4";
import textDraggable from "@/assets/videos/cdielts-text-draggable.mp4";
import formatlash from "@/assets/videos/cdielts-formatlash-va-jadval.mp4";

const docs = [
  {
    videoUrl: kirish,
    title: `Kuzatuvchi va ustoz uchun kirish qo'llanma`,
    description: `Videoda kuzatuvchi va ustoz rolidagi foydalanuvchilar uchun kirish funksiyalar va imkoniyatlar haqida ma'lumot berilgan.`,
  },
  {
    videoUrl: testgaKirish,
    title: `Ustoz uchun testga kirish qo'llanma`,
    description: `Videoda ustoz rolidagi foydalanuvchilar uchun testga kirish va uni boshqarish haqida ma'lumot berilgan. Hamda, test havolalarini qisman ishlatish va shablon yaratish to'g'risida ham ma'lumot berilgan.`,
  },
  {
    videoUrl: javoblar,
    title: `Ustoz uchun javoblarni baholash va natijalarni chiqarish uchun qo'llanma`,
    description: `Videoda ustoz rolidagi foydalanuvchilar uchun testdan olingan javoblarni baholab, natija chiqarish haqida ma'lumot berilgan.`,
  },
  {
    videoUrl: partlar,
    title: `Ustoz uchun test modullariga qismlar qo'shish bo'yicha qo'llanma`,
    description: `Videoda ustoz rolidagi foydalanuvchilar uchun test modullariga qism (PART) qo'shish va uni boshqarish haqida ma'lumot berilgan. Hamda, test havolalarini qisman ishlatish va shablon yaratish to'g'risida ham ma'lumot berilgan.`,
  },
  {
    videoUrl: modulVaqtlari,
    title: `Ustoz uchun test modullari vaqtlarini sozlash va audio qo'shish bo'yicha qo'llanma`,
    description: `Videoda ustoz rolidagi foydalanuvchilar uchun test modullarining vaqtlarini sozlash va audio fayllarini qo'shish haqida ma'lumot berilgan.`,
  },
  {
    videoUrl: formatlash,
    title: `Ustoz uchun test savollariga kirish (FORMATLASH va JADVAL) qo'llanma`,
    description: `Videoda ustoz rolidagi foydalanuvchilar uchun test savollari matnlarini formatlash va jadval hosil qilish bo'yicha ma'lumot berilgan.`,
  },
  {
    videoUrl: text,
    title: `Ustoz uchun testning TEXT turidagi savol bo'limidan foydalanish uchun qo'llanma`,
  },
  {
    videoUrl: textDraggable,
    title: `Ustoz uchun testning TEXT DRAGGABLE turidagi savol bo'limidan foydalanish uchun qo'llanma`,
  },
  {
    videoUrl: flowchart,
    title: `Ustoz uchun testning FLOWCHART va INPUT FLOWCHART turlaridagi savol bo'limlaridan foydalanish uchun qo'llanma`,
  },
  {
    videoUrl: radioGroup,
    title: `Ustoz uchun testning RADIO GROUP va CHECKBOX GROUP turlaridagi savol bo'limlaridan foydalanish uchun qo'llanma`,
    description: `RADIO GROUP true/false/not given savollari kabi savollar uchun ishlatiladi. CHECKBOX GROUP esa ko'p javobli (Multiple choice) savollar uchun ishlatiladi.`,
  },
];

export default docs;
