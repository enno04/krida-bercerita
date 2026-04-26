export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export type Story = {
  slug: string;
  title: string;
  province: string;
  region: string;
  summary: string;
  image: string;
  content: string[];
  moral: string;
  quiz: QuizQuestion[];
};

export const stories: Story[] = [
  {
    slug: "malin-kundang",
    title: "Malin Kundang",
    province: "Sumatera Barat",
    region: "Sumatera",
    summary:
      "Kisah tentang seorang anak yang lupa pada ibunya setelah meraih kesuksesan.",
    image: "/cerita.png",
    content: [
      "Dahulu kala, di sebuah desa pesisir Sumatera Barat, hiduplah seorang ibu bersama anaknya yang bernama Malin Kundang. Mereka hidup sederhana, tetapi sang ibu selalu menyayangi Malin dengan sepenuh hati.",
      "Ketika Malin tumbuh dewasa, ia ingin merantau untuk mengubah nasib. Ibunya mengizinkan Malin pergi meskipun hatinya berat. Malin pun berjanji akan kembali setelah berhasil.",
      "Bertahun-tahun kemudian, Malin menjadi saudagar kaya. Ia datang kembali ke kampung halamannya dengan kapal besar dan pakaian mewah.",
      "Sang ibu yang melihat Malin segera menghampirinya. Namun, Malin merasa malu mengakui ibunya yang sudah tua dan sederhana. Ia menolak ibunya di hadapan banyak orang.",
      "Hati sang ibu hancur. Ia berdoa agar Malin mendapat pelajaran atas kedurhakaannya. Tidak lama kemudian, badai besar datang dan kapal Malin hancur. Malin pun dikutuk menjadi batu.",
    ],
    moral:
      "Jangan pernah melupakan jasa orang tua. Kesuksesan tidak boleh membuat seseorang menjadi sombong dan durhaka.",
    quiz: [
        {
            question: "Apa pesan utama dari cerita ini?",
            options: [
                "Berbuat baik dan belajar dari kesalahan",
                "Menjadi sombong setelah sukses",
                "Tidak perlu menghormati orang lain",
                "Mengabaikan keluarga",
            ],
            answer: "Berbuat baik dan belajar dari kesalahan",
        },
    ],  
  },
  {
    slug: "timun-mas",
    title: "Timun Mas",
    province: "Jawa Tengah",
    region: "Jawa",
    summary:
      "Cerita keberanian seorang anak perempuan menghadapi raksasa jahat.",
    image: "/cerita.png",
    content: [
      "Pada zaman dahulu, hiduplah seorang perempuan tua yang sangat menginginkan seorang anak. Suatu hari, ia bertemu raksasa yang memberinya biji timun ajaib.",
      "Perempuan itu menanam biji tersebut. Tidak lama kemudian, tumbuhlah timun besar berwarna keemasan. Saat dibelah, di dalamnya terdapat bayi perempuan yang cantik. Bayi itu diberi nama Timun Mas.",
      "Timun Mas tumbuh menjadi anak yang baik dan pemberani. Namun, raksasa datang menagih janji untuk membawa Timun Mas.",
      "Dengan bantuan benda-benda ajaib dari seorang pertapa, Timun Mas melarikan diri. Ia melempar biji timun, jarum, garam, dan terasi yang berubah menjadi rintangan bagi raksasa.",
      "Akhirnya, raksasa berhasil dikalahkan. Timun Mas kembali kepada ibunya dan mereka hidup bahagia.",
    ],
    moral:
      "Keberanian, kecerdikan, dan doa dapat membantu seseorang menghadapi masalah yang berat.",
          quiz: [
        {
            question: "Apa pesan utama dari cerita ini?",
            options: [
                "Berbuat baik dan belajar dari kesalahan",
                "Menjadi sombong setelah sukses",
                "Tidak perlu menghormati orang lain",
                "Mengabaikan keluarga",
            ],
            answer: "Berbuat baik dan belajar dari kesalahan",
        },
    ],
  },
  {
    slug: "danau-toba",
    title: "Legenda Danau Toba",
    province: "Sumatera Utara",
    region: "Sumatera",
    summary:
      "Legenda tentang asal-usul danau besar yang terkenal dari tanah Batak.",
    image: "/cerita.png",
    content: [
      "Dahulu kala, hiduplah seorang pemuda yang bekerja sebagai petani. Suatu hari, ia menangkap seekor ikan besar yang sangat indah.",
      "Ajaibnya, ikan itu berubah menjadi perempuan cantik. Mereka kemudian menikah dengan satu syarat: sang pemuda tidak boleh mengungkap asal-usul istrinya.",
      "Mereka hidup bahagia dan memiliki seorang anak. Namun suatu hari, sang ayah marah kepada anaknya dan tanpa sengaja membuka rahasia ibunya.",
      "Langit menjadi gelap dan hujan turun sangat deras. Air memenuhi lembah dan membentuk danau yang sangat luas.",
      "Danau itu kemudian dikenal sebagai Danau Toba, sementara pulau di tengahnya dikenal sebagai Pulau Samosir.",
    ],
    moral:
      "Menjaga janji adalah hal penting. Ucapan yang keluar saat marah dapat membawa akibat besar.",
          quiz: [
        {
            question: "Apa pesan utama dari cerita ini?",
            options: [
                "Berbuat baik dan belajar dari kesalahan",
                "Menjadi sombong setelah sukses",
                "Tidak perlu menghormati orang lain",
                "Mengabaikan keluarga",
            ],
            answer: "Berbuat baik dan belajar dari kesalahan",
        },
    ],
  },
  {
    slug: "sangkuriang",
    title: "Sangkuriang",
    province: "Jawa Barat",
    region: "Jawa",
    summary:
      "Legenda asal-usul Gunung Tangkuban Perahu yang terkenal dari tanah Sunda.",
    image: "/cerita.png",
    content: [
      "Sangkuriang adalah seorang pemuda sakti yang tanpa sadar jatuh cinta kepada ibunya sendiri, Dayang Sumbi.",
      "Dayang Sumbi mengetahui kenyataan itu dan berusaha menggagalkan keinginan Sangkuriang dengan memberi syarat yang sangat sulit.",
      "Sangkuriang diminta membuat danau dan perahu besar dalam satu malam. Dengan kesaktiannya, ia hampir menyelesaikan tugas itu.",
      "Dayang Sumbi mencari cara agar fajar tampak datang lebih cepat. Sangkuriang marah karena merasa gagal.",
      "Ia menendang perahu yang dibuatnya hingga terbalik. Perahu itu kemudian dipercaya menjadi Gunung Tangkuban Perahu.",
    ],
    moral:
      "Amarah dan keinginan yang tidak terkendali dapat membawa akibat buruk.",
          quiz: [
        {
            question: "Apa pesan utama dari cerita ini?",
            options: [
                "Berbuat baik dan belajar dari kesalahan",
                "Menjadi sombong setelah sukses",
                "Tidak perlu menghormati orang lain",
                "Mengabaikan keluarga",
            ],
            answer: "Berbuat baik dan belajar dari kesalahan",
        },
    ],
  },
  {
    slug: "bawang-merah-bawang-putih",
    title: "Bawang Merah Bawang Putih",
    province: "Riau",
    region: "Sumatera",
    summary:
      "Cerita tentang kebaikan hati, kesabaran, dan balasan bagi perilaku buruk.",
    image: "/cerita.png",
    content: [
      "Bawang Putih adalah gadis baik hati yang tinggal bersama ibu tiri dan saudara tirinya, Bawang Merah.",
      "Setiap hari, Bawang Putih harus bekerja keras, sementara Bawang Merah sering bermalas-malasan.",
      "Suatu hari, kebaikan Bawang Putih membawanya kepada hadiah yang berharga. Sebaliknya, keserakahan Bawang Merah membawa akibat buruk.",
      "Cerita ini menunjukkan bahwa kebaikan dan kesabaran akan mendapatkan balasan yang baik.",
    ],
    moral:
      "Bersikap baik, sabar, dan tidak serakah adalah nilai penting dalam kehidupan.",
          quiz: [
        {
            question: "Apa pesan utama dari cerita ini?",
            options: [
                "Berbuat baik dan belajar dari kesalahan",
                "Menjadi sombong setelah sukses",
                "Tidak perlu menghormati orang lain",
                "Mengabaikan keluarga",
            ],
            answer: "Berbuat baik dan belajar dari kesalahan",
        },
    ],
  },
  {
    slug: "keong-mas",
    title: "Keong Mas",
    province: "Jawa Timur",
    region: "Jawa",
    summary:
      "Kisah putri yang berubah menjadi keong emas dan akhirnya menemukan kebahagiaan.",
    image: "/cerita.png",
    content: [
      "Keong Mas berkisah tentang seorang putri yang terkena kutukan dan berubah menjadi keong berwarna emas.",
      "Keong itu ditemukan oleh seorang nenek yang baik hati. Setiap hari, rumah nenek menjadi rapi dan makanan tersedia secara misterius.",
      "Akhirnya, rahasia keong emas terbongkar. Sang putri kembali ke wujud aslinya dan menemukan kebahagiaan.",
    ],
    moral:
      "Kebaikan hati akan membawa pertolongan dan kebahagiaan pada waktunya.",
    quiz: [
      {
        question: "Apa pesan utama dari cerita ini?",
        options: [
          "Berbuat baik dan belajar dari kesalahan",
          "Menjadi sombong setelah sukses",
          "Tidak perlu menghormati orang lain",
          "Mengabaikan keluarga",
        ],
        answer: "Berbuat baik dan belajar dari kesalahan",
      },
    ],
  },
  {
    slug: "batu-menangis",
    title: "Batu Menangis",
    province: "Kalimantan Barat",
    region: "Kalimantan",
    summary:
      "Cerita tentang seorang anak yang malu mengakui ibunya dan mendapat pelajaran hidup.",
    image: "/cerita.png",
    content: [
      "Dahulu, hiduplah seorang gadis cantik bersama ibunya yang miskin. Gadis itu sering bersikap kasar dan malu mengakui ibunya.",
      "Suatu hari, mereka pergi ke pasar. Banyak orang bertanya siapa perempuan tua yang berjalan bersamanya.",
      "Gadis itu menjawab bahwa perempuan tua itu adalah pembantunya, bukan ibunya. Sang ibu sangat sedih mendengar jawaban itu.",
      "Karena kedurhakaannya, gadis itu perlahan berubah menjadi batu sambil menangis.",
    ],
    moral:
      "Hormatilah orang tua dan jangan pernah malu mengakui keluarga sendiri.",
          quiz: [
        {
            question: "Apa pesan utama dari cerita ini?",
            options: [
                "Berbuat baik dan belajar dari kesalahan",
                "Menjadi sombong setelah sukses",
                "Tidak perlu menghormati orang lain",
                "Mengabaikan keluarga",
            ],
            answer: "Berbuat baik dan belajar dari kesalahan",
        },
    ],
  },
  {
    slug: "la-misso",
    title: "La Misso",
    province: "Sulawesi Selatan",
    region: "Sulawesi",
    summary:
      "Cerita rakyat tentang keberanian, kecerdikan, dan kebijaksanaan dalam menghadapi masalah.",
    image: "/cerita.png",
    content: [
      "La Misso dikenal sebagai tokoh yang berani dan cerdik. Ia sering membantu masyarakat menyelesaikan masalah.",
      "Dengan kebijaksanaan dan keberanian, La Misso menjadi contoh bagi orang-orang di sekitarnya.",
      "Cerita ini mengajarkan bahwa keberanian harus disertai akal sehat dan sikap bijaksana.",
    ],
    moral:
      "Keberanian yang disertai kebijaksanaan dapat membawa kebaikan bagi banyak orang.",
          quiz: [
        {
            question: "Apa pesan utama dari cerita ini?",
            options: [
                "Berbuat baik dan belajar dari kesalahan",
                "Menjadi sombong setelah sukses",
                "Tidak perlu menghormati orang lain",
                "Mengabaikan keluarga",
            ],
            answer: "Berbuat baik dan belajar dari kesalahan",
        },
    ],
  },
  {
    slug: "asal-usul-burung-cenderawasih",
    title: "Asal-usul Burung Cenderawasih",
    province: "Papua",
    region: "Papua",
    summary:
      "Kisah rakyat Papua yang mengenalkan keindahan burung cenderawasih dan pesan moralnya.",
    image: "/cerita.png",
    content: [
      "Di tanah Papua, terdapat kisah tentang burung cenderawasih yang indah dan penuh makna.",
      "Burung ini sering dikaitkan dengan keindahan, kehormatan, dan pesan untuk menjaga alam.",
      "Cerita rakyat ini mengingatkan manusia agar tidak merusak alam dan selalu menghargai makhluk hidup.",
    ],
    moral:
      "Keindahan alam harus dijaga dan dihormati sebagai bagian dari kehidupan.",
          quiz: [
        {
            question: "Apa pesan utama dari cerita ini?",
            options: [
                "Berbuat baik dan belajar dari kesalahan",
                "Menjadi sombong setelah sukses",
                "Tidak perlu menghormati orang lain",
                "Mengabaikan keluarga",
            ],
            answer: "Berbuat baik dan belajar dari kesalahan",
        },
    ],
  },
];