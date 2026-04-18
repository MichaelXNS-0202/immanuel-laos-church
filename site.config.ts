/**
 * ==========================================================================
 *  IMMANUEL-LAOS CHURCH — SITE CONFIGURATION
 *  ອີມານູເອນ-ລາວ ຄຣິສຕະຈັກ — ການຕັ້ງຄ່າເວັບໄຊ
 * ==========================================================================
 *
 *  This is the ONE file you edit to update church details across the site.
 *  ນີ້ແມ່ນໄຟລ໌ດຽວທີ່ທ່ານແກ້ໄຂເພື່ອປ່ຽນຂໍ້ມູນໂບດໃນເວັບໄຊທັງໝົດ.
 *
 *  After editing, save the file — the site auto-updates.
 * ==========================================================================
 */

export const site = {
  // ——— Church identity ———
  name: 'ອີມານູເອນ-ລາວ ຄຣິສຕະຈັກ',
  nameEnglish: 'Immanuel-Laos Church',
  tagline: 'ຄຣິສຕະຈັກຂອງພຣະເຈົ້າ — ບ້ານແຫ່ງຄວາມຮັກ ແລະ ຄວາມຫວັງ',

  // ——— Contact info ———
  address: {
    street: '[ບ້ານ ໜອງວຽງຄຳ]',
    city: 'ໄຊທານີ',
    country: 'ລາວ',
  },
  phone: '+856 __ ___ ____',
  email: 'contact@immanuel-laos.org',

  // ——— Leadership ———
  pastor: {
    name: '[ຊື່ສິດຍາພິບານ]',
    title: 'ສິດຍາພິບານ',
  },

  // ——— Service times ———
  services: [
    { day: 'ວັນອາທິດ', time: '10:00 ເຊົ້າ', name: 'ການນະມັດສະການຕົ້ນຕໍ' },
    { day: 'ວັນພຸດ', time: '19:00 ແລງ', name: 'ການອະທິຖານ ແລະ ສຶກສາພຣະຄຳພີ' },
  ],

  // ——— Social & external links ———
  social: {
    facebook: '', // e.g. 'https://facebook.com/yourchurch'
    youtube: '',  // e.g. 'https://youtube.com/@yourchurch'
    livestreamEmbedUrl: '', // e.g. 'https://www.youtube.com/embed/live_stream?channel=UCxxxxxxxx'
  },

  // ——— Giving / donations ———
  giving: {
    // Paste your Stripe Payment Link, PayPal.me URL, or bank details here.
    // If empty, the giving page shows a "coming soon" message.
    paymentLinkUrl: '',
    bankInfo: {
      bankName: '',
      accountName: '',
      accountNumber: '',
    },
  },

  // ——— SEO / metadata ———
  seo: {
    defaultDescription:
      'ອີມານູເອນ-ລາວ ຄຣິສຕະຈັກ — ຂ່າວສານ, ຄຳເທດສະໜາ, ເຫດການ ແລະ ການນະມັດສະການ.',
    locale: 'lo_LA',
  },
} as const;

/**
 * Navigation items shown in the header/footer.
 * ລາຍການເມນູ — ແກ້ໄຂຊື່ເມນູຫຼືລຳດັບໄດ້ທີ່ນີ້.
 */
export const nav = [
  { href: '/',            label: 'ໜ້າຫຼັກ' },
  { href: '/news',        label: 'ຂ່າວສານ' },
  { href: '/sermons',     label: 'ຄຳເທດສະໜາ' },
  { href: '/events',      label: 'ເຫດການ' },
  { href: '/gallery',     label: 'ຄັງຮູບພາບ' },
  { href: '/livestream',  label: 'ຖ່າຍທອດສົດ' },
  { href: '/giving',      label: 'ການບໍລິຈາກ' },
  { href: '/contact',     label: 'ຕິດຕໍ່' },
] as const;
