import { SubjectTopic, TheoryLesson } from '../types';

export const SUBJECT_TOPICS: SubjectTopic[] = [
  {
    id: 'topic_a',
    code: 'A',
    title: 'Chủ đề A: Máy tính và xã hội tri thức',
    shortTitle: 'Máy tính & AI',
    description: 'Hệ điều hành, phần mềm ứng dụng, thiết bị số thông minh, trí tuệ nhân tạo (AI) và ứng dụng thực tiễn.',
    track: 'CORE',
    iconName: 'Cpu',
    color: 'emerald',
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderColor: 'border-emerald-500',
    lessonsCount: 3
  },
  {
    id: 'topic_b',
    code: 'B',
    title: 'Chủ đề B: Mạng máy tính và Internet',
    shortTitle: 'Mạng & Internet',
    description: 'Kiến trúc mạng máy tính, giao thức TCP/IP, thiết bị kết nối Switch/Router, an toàn và bảo mật thông tin.',
    track: 'CORE',
    iconName: 'Globe',
    color: 'blue',
    bgLight: 'bg-blue-50 text-blue-700 border-blue-200',
    borderColor: 'border-blue-500',
    lessonsCount: 3
  },
  {
    id: 'topic_d',
    code: 'D',
    title: 'Chủ đề D: Đạo đức, pháp luật và văn hóa số',
    shortTitle: 'Pháp luật & Bản quyền số',
    description: 'Bản quyền phần mềm số, Luật An ninh mạng, tính nhân văn và hành vi văn minh trên không gian số.',
    track: 'CORE',
    iconName: 'ShieldCheck',
    color: 'amber',
    bgLight: 'bg-amber-50 text-amber-700 border-amber-200',
    borderColor: 'border-amber-500',
    lessonsCount: 2
  },
  {
    id: 'topic_e',
    code: 'E',
    title: 'Chủ đề E: Ứng dụng tin học (Định hướng ICT)',
    shortTitle: 'Hệ CSDL & Ngôn ngữ SQL',
    description: 'Cơ sở dữ liệu quan hệ, mô hình quan hệ, khóa chính, khóa ngoại, ngôn ngữ truy vấn có cấu trúc SQL.',
    track: 'ICT',
    iconName: 'Database',
    color: 'indigo',
    bgLight: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    borderColor: 'border-indigo-500',
    lessonsCount: 4
  },
  {
    id: 'topic_f',
    code: 'F',
    title: 'Chủ đề F: Giải quyết vấn đề (Định hướng CS)',
    shortTitle: 'Thuật toán & Lập trình Python',
    description: 'Cấu trúc dữ liệu, thuật toán đệ quy, sắp xếp, tìm kiếm nhị phân, lập trình giải quyết bài toán thực tế.',
    track: 'CS',
    iconName: 'Code2',
    color: 'purple',
    bgLight: 'bg-purple-50 text-purple-700 border-purple-200',
    borderColor: 'border-purple-500',
    lessonsCount: 3
  },
  {
    id: 'topic_g',
    code: 'G',
    title: 'Chủ đề G: Hướng nghiệp với Tin học',
    shortTitle: 'Định hướng nghề nghiệp CNTT',
    description: 'Bản đồ nghề nghiệp công nghệ thông tin, kỹ sư phần mềm, chuyên gia AI, an ninh mạng và kỹ năng tương lai.',
    track: 'CORE',
    iconName: 'Briefcase',
    color: 'rose',
    bgLight: 'bg-rose-50 text-rose-700 border-rose-200',
    borderColor: 'border-rose-500',
    lessonsCount: 2
  }
];

export const INITIAL_LESSONS: TheoryLesson[] = [
  // CHỦ ĐỀ A
  {
    id: 'lesson_a1',
    topicId: 'topic_a',
    title: 'Bài 1: Hệ điều hành và Phần mềm ứng dụng',
    order: 1,
    summary: 'Phân biệt chức năng cốt lõi của Hệ điều hành (OS) với phần mềm ứng dụng, cơ chế quản lý tài nguyên và giao tiếp người - máy.',
    contentMarkdown: `### 1. Khái niệm Hệ điều hành (Operating System)
Hệ điều hành là tập hợp các chương trình hệ thống làm trung gian giữa phần cứng máy tính và người dùng/phần mềm ứng dụng.

### 2. Các chức năng chính của Hệ điều hành:
* **Quản lý thiết bị phần cứng**: CPU, bộ nhớ RAM, thiết bị vào/ra (I/O), ổ đĩa lưu trữ.
* **Quản lý tiến trình (Process)**: Phân phối thời gian xử lý của CPU, điều phối đa nhiệm.
* **Quản lý tệp tin và thư mục (File System)**: Tổ chức lưu trữ dạng cây (hierarchical tree), phân quyền truy cập.
* **Cung cấp giao diện người dùng**: Giao diện dòng lệnh (CLI) hoặc giao diện đồ họa (GUI).

### 3. Phân biệt Hệ điều hành nguồn mở và nguồn đóng:
* **Nguồn đóng (Proprietary)**: Microsoft Windows, macOS, iOS.
* **Nguồn mở (Open-source)**: Linux (Ubuntu, Debian, Fedora), Android.`,
    keyTakeaways: [
      'Hệ điều hành quản lý tài nguyên phần cứng và cung cấp môi trường chạy cho các ứng dụng.',
      'Phần mềm ứng dụng phục vụ nhu cầu nghiệp vụ cụ thể của người dùng (Word, Excel, Trình duyệt web...).',
      'Linux và Android là các hệ điều hành mã nguồn mở phổ biến.'
    ],
    examTips: [
      'Chú ý bẫy câu hỏi: BIOS/ROM không phải là hệ điều hành, mà là phần mềm hệ thống nhúng khởi động máy tính.',
      'Hệ điều hành quản lý bộ nhớ thông qua cơ chế phân trang (paging) và bộ nhớ ảo (virtual memory).'
    ],
    author: 'Tổ Chuyên Môn Tin Học THPT',
    updatedAt: '2025-01-10'
  },
  {
    id: 'lesson_a2',
    topicId: 'topic_a',
    title: 'Bài 2: Trí tuệ nhân tạo (AI) và Ứng dụng thực tiễn',
    order: 2,
    summary: 'Hiểu về bản chất của AI, học máy (Machine Learning), học sâu (Deep Learning) và tác động của AI trong cuộc sống hiện đại.',
    contentMarkdown: `### 1. Khái niệm Trí tuệ nhân tạo (AI)
Trí tuệ nhân tạo là khả năng của máy tính hoặc hệ thống kỹ thuật số thực hiện các nhiệm vụ đòi hỏi trí thông minh của con người (suy luận, học hỏi, thích nghi, nhận dạng hình ảnh/tiếng nói).

### 2. Các nhánh chính của AI hiện đại:
* **Học máy (Machine Learning - ML)**: Máy tính tự rút ra quy luật từ tập dữ liệu mẫu mà không cần lập trình quy tắc tường minh.
* **Học sâu (Deep Learning - DL)**: Sử dụng mạng nơ-ron nhân tạo nhiều lớp (Artificial Neural Networks) để nhận dạng mẫu phức tạp.
* **Xử lý ngôn ngữ tự nhiên (NLP)**: Dịch thuật, tóm tắt văn bản, chatbot thông minh, mô hình ngôn ngữ lớn (LLM).
* **Thị giác máy tính (Computer Vision)**: Nhận diện khuôn mặt, phát hiện vật thể xe tự hành, phân tích ảnh y tế.

### 3. Đạo đức và an toàn AI:
Vấn đề thiên vị dữ liệu (data bias), quyền riêng tư, bản quyền dữ liệu huấn luyện và nguy cơ thông tin giả mạo (Deepfake).`,
    keyTakeaways: [
      'Machine Learning là tập con của AI, Deep Learning là tập con của Machine Learning.',
      'AI dựa trên dữ liệu lớn (Big Data) và thuật toán học tăng cường/học có giám sát/không giám sát.',
      'Ứng dụng AI bao gồm: Nhận diện giọng nói, xe tự hành, chẩn đoán y khoa, trợ lý ảo.'
    ],
    examTips: [
      'Đề thi thường hỏi về mối quan hệ phân cấp: AI ⊃ Machine Learning ⊃ Deep Learning.',
      'Cần phân biệt AI hẹp (Narrow AI - chỉ làm tốt 1 việc cụ thể như cờ vua/nhận diện) và AI tổng quát (AGI).'
    ],
    author: 'Tổ Chuyên Môn Tin Học THPT',
    updatedAt: '2025-01-15'
  },

  // CHỦ ĐỀ B
  {
    id: 'lesson_b1',
    topicId: 'topic_b',
    title: 'Bài 1: Kiến trúc Mạng máy tính và Giao thức TCP/IP',
    order: 1,
    summary: 'Nguyên lý truyền thông mạng, mô hình phân tầng, địa chỉ IP (IPv4, IPv6), thiết bị Switch, Router và DNS.',
    contentMarkdown: `### 1. Khái niệm Mạng máy tính
Mạng máy tính là tập hợp các máy tính và thiết bị được kết nối với nhau thông qua đường truyền vật lý để chia sẻ tài nguyên và trao đổi dữ liệu.

### 2. Thiết bị mạng cơ bản:
* **Switch (Bộ chuyển mạch)**: Làm việc ở tầng liên kết dữ liệu, chuyển tiếp gói tin dựa trên địa chỉ MAC trong cùng mạng LAN.
* **Router (Bộ định tuyến)**: Làm việc ở tầng mạng, định tuyến gói tin giữa các mạng khác nhau dựa trên địa chỉ IP.
* **Access Point (Điểm truy cập không dây)**: Cung cấp kết nối Wi-Fi cho các thiết bị số.

### 3. Bộ giao thức TCP/IP:
* **Tầng Ứng dụng (Application)**: HTTP, HTTPS, FTP, SMTP, DNS.
* **Tầng Giao vận (Transport)**: 
  - **TCP**: Hướng kết nối, đảm bảo truyền tin tin cậy, không mất gói.
  - **UDP**: Không hướng kết nối, tốc độ nhanh, chấp nhận mất gói (streaming, game online).
* **Tầng Mạng (Internet)**: IP (IPv4 32-bit, IPv6 128-bit).
* **Tầng Truy cập mạng (Network Access)**: Ethernet, Wi-Fi.`,
    keyTakeaways: [
      'Địa chỉ IPv4 có độ dài 32 bit (4 byte), IPv6 có độ dài 128 bit (16 byte).',
      'Router chuyển tiếp gói tin giữa các mạng khác nhau; Switch kết nối các thiết bị trong cùng mạng nội bộ (LAN).',
      'DNS (Domain Name System) chuyển đổi tên miền sang địa chỉ IP tương ứng.'
    ],
    examTips: [
      'Ghi nhớ: HTTPS sử dụng cổng mặc định 443, HTTP dùng cổng 80, DNS dùng cổng 53.',
      'IPv4 biểu diễn dưới dạng 4 số thập phân cách nhau bởi dấu chấm (ví dụ: 192.168.1.1).'
    ],
    author: 'Tổ Chuyên Môn Tin Học THPT',
    updatedAt: '2025-01-12'
  },
  {
    id: 'lesson_b2',
    topicId: 'topic_b',
    title: 'Bài 2: An toàn thông tin và Phòng chống mã độc',
    order: 2,
    summary: 'Các mối đe dọa an toàn mạng (Virus, Trojan, Ransomware, Phishing), giải pháp mã hóa dữ liệu và xác thực 2 yếu tố (2FA).',
    contentMarkdown: `### 1. Phân loại mã độc hại (Malware):
* **Virus**: Đoạn mã tự nhân bản bằng cách lây nhiễm vào các tệp tin thực thi (.exe, .doc).
* **Worm (Sâu máy tính)**: Tự lây lan độc lập qua mạng mà không cần tương tác người dùng.
* **Trojan Horse**: Ẩn danh dưới vỏ bọc phần mềm hữu ích để mở cổng sau (backdoor).
* **Ransomware (Mã độc tống tiền)**: Mã hóa dữ liệu nạn nhân và đòi tiền chuộc để giải mã.
* **Phishing (Tấn công giả mạo)**: Lừa người dùng cung cấp thông tin nhạy cảm qua email hoặc website giả mạo.

### 2. Các biện pháp bảo vệ:
* Đặt mật khẩu mạnh (chữ hoa, thường, số, ký tự đặc biệt) và sử dụng xác thực đa yếu tố (MFA/2FA).
* Cài đặt tường lửa (Firewall) và phần mềm diệt virus có bản quyền.
* Sao lưu dữ liệu định kỳ theo nguyên tắc 3-2-1.`,
    keyTakeaways: [
      'Ransomware là mã độc chuyên mã hóa dữ liệu đòi tiền chuộc.',
      'Xác thực 2 yếu tố (2FA) kết hợp mật khẩu với mã OTP hoặc sinh trắc học để bảo vệ tài khoản.',
      'Không mở liên kết lạ hoặc tệp đính kèm trong email khả nghi.'
    ],
    examTips: [
      'Phân biệt Virus (cần tệp vật chủ) và Worm (lây lan độc lập qua mạng).',
      'Firewall kiểm soát lưu lượng ra vào mạng dựa trên các quy tắc bảo mật.'
    ],
    author: 'Tổ Chuyên Môn Tin Học THPT',
    updatedAt: '2025-01-18'
  },

  // CHỦ ĐỀ D
  {
    id: 'lesson_d1',
    topicId: 'topic_d',
    title: 'Bài 1: Pháp luật, Bản quyền số và Văn hóa ứng xử số',
    order: 1,
    summary: 'Quy định pháp luật về sở hữu trí tuệ, bản quyền phần mềm, Luật An ninh mạng Việt Nam và văn hóa ứng xử trên mạng xã hội.',
    contentMarkdown: `### 1. Luật Sở hữu trí tuệ và Bản quyền phần mềm:
* Phần mềm máy tính được bảo hộ như tác phẩm văn học theo quy định của pháp luật Việt Nam.
* Các loại giấy phép phần mềm:
  - **Bản quyền thương mại (Proprietary License)**: Phải trả phí, không được sao chép/chỉnh sửa mã nguồn.
  - **Mã nguồn mở (Open Source - GPL, MIT, Apache)**: Cho phép xem, sửa đổi và phân phối lại mã nguồn theo điều kiện cấp phép.
  - **Miễn phí (Freeware / Shareware)**: Được dùng thử hoặc miễn phí cho mục đích phi thương mại.

### 2. Luật An ninh mạng:
Nghiêm cấm các hành vi:
* Phát tán thông tin sai sự thật, xúc phạm danh dự nhân phẩm người khác.
* Tấn công từ chối dịch vụ (DDoS), xâm nhập trái phép hệ thống thông tin.
* Đánh cắp, mua bán thông tin cá nhân của người dùng.`,
    keyTakeaways: [
      'Phần mềm máy tính được pháp luật bảo hộ quyền tác giả.',
      'Giấy phép nguồn mở cho phép người dùng tự do nghiên cứu, cải tiến và phân phối.',
      'Tuân thủ Luật An ninh mạng khi tham gia môi trường trực tuyến.'
    ],
    examTips: [
      'Nhớ rõ: Việc crack hoặc chia sẻ key bản quyền phần mềm lậu là vi phạm pháp luật sở hữu trí tuệ.'
    ],
    author: 'Tổ Chuyên Môn Tin Học THPT',
    updatedAt: '2025-01-20'
  },

  // CHỦ ĐỀ E (ĐỊNH HƯỚNG ICT)
  {
    id: 'lesson_e1',
    topicId: 'topic_e',
    title: 'Bài 1: Cơ sở dữ liệu quan hệ và Mô hình dữ liệu quan hệ',
    order: 1,
    summary: 'Khái niệm CSDL quan hệ (RDBMS), cấu trúc Bảng (Table), Trường (Field/Column), Bản ghi (Record/Row), Khóa chính (Primary Key) và Khóa ngoại (Foreign Key).',
    contentMarkdown: `### 1. Mô hình dữ liệu quan hệ (Relational Model)
Dữ liệu trong mô hình quan hệ được tổ chức dưới dạng các **bảng (Table/Relation)** hai chiều gồm:
* **Cột (Field / Attribute / Trường)**: Đại diện cho một thuộc tính của đối tượng. Mỗi cột có một kiểu dữ liệu xác định (INT, VARCHAR, DATE, BOOLEAN...).
* **Hàng (Record / Tuple / Bản ghi)**: Đại diện cho một đối tượng cụ thể chứa các giá trị thuộc tính tương ứng.

### 2. Các khái niệm Khóa trong CSDL:
* **Khóa chính (Primary Key - PK)**: Là một hoặc một tập hợp các trường dùng để xác định duy nhất mỗi bản ghi trong bảng.
  - **Quy tắc bắt buộc**: Không được chứa giá trị trùng lặp và KHÔNG ĐƯỢC CHỨA GIÁ TRỊ RỖNG (NOT NULL).
* **Khóa ngoại (Foreign Key - FK)**: Là trường trong một bảng tham chiếu đến Khóa chính của một bảng khác, nhằm thiết lập mối liên kết giữa các bảng và đảm bảo tính toàn vẹn tham chiếu.

### 3. Các loại quan hệ giữa các bảng:
* **1 - 1 (Một - Một)**
* **1 - N (Một - Nhiều)**: Phổ biến nhất trong thực tế (Ví dụ: Một Lớp học có Nhiều Học sinh).
* **N - N (Nhiều - Nhiều)**: Cần tách thành 2 quan hệ 1 - N thông qua bảng trung gian.`,
    keyTakeaways: [
      'Khóa chính xác định duy nhất từng bản ghi, không được rỗng (NOT NULL) và không được trùng.',
      'Khóa ngoại tạo liên kết giữa các bảng và đảm bảo tính toàn vẹn tham chiếu (Referential Integrity).',
      'Hệ quản trị CSDL quan hệ phổ biến: MySQL, PostgreSQL, Microsoft SQL Server, Oracle, SQLite, Access.'
    ],
    codeSnippets: [
      {
        language: 'sql',
        title: 'Tạo bảng HOC_SINH với Khóa chính và Khóa ngoại',
        code: `CREATE TABLE LOP (
    MaLop VARCHAR(10) PRIMARY KEY,
    TenLop VARCHAR(50) NOT NULL
);

CREATE TABLE HOC_SINH (
    MaHS VARCHAR(10) PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    NgaySinh DATE,
    GioiTinh VARCHAR(5),
    MaLop VARCHAR(10),
    FOREIGN KEY (MaLop) REFERENCES LOP(MaLop)
);`
      }
    ],
    examTips: [
      'Khóa chính có thể bao gồm nhiều trường (gọi là khóa phức hợp / composite key).',
      'Mỗi bảng chỉ có duy nhất 1 khóa chính, nhưng có thể có nhiều khóa ngoại.'
    ],
    author: 'Tổ Chuyên Môn Tin Học THPT',
    updatedAt: '2025-01-22'
  },
  {
    id: 'lesson_e2',
    topicId: 'topic_e',
    title: 'Bài 2: Ngôn ngữ truy vấn dữ liệu SQL (DML & DDL)',
    order: 2,
    summary: 'Cú pháp chuẩn các câu lệnh truy vấn SQL: SELECT, FROM, WHERE, ORDER BY, GROUP BY, HAVING, INSERT, UPDATE, DELETE.',
    contentMarkdown: `### 1. Cấu trúc câu lệnh truy vấn SELECT cơ bản:
\`\`\`sql
SELECT column1, column2, AGG_FUNC(column3)
FROM table_name
WHERE condition
GROUP BY column1, column2
HAVING agg_condition
ORDER BY column1 [ASC | DESC]
LIMIT n;
\`\`\`

### 2. Các mệnh đề trong SQL:
* **SELECT**: Chỉ định danh sách cột cần hiển thị. Dùng \`DISTINCT\` để loại bỏ giá trị trùng.
* **FROM**: Bảng nguồn chứa dữ liệu.
* **WHERE**: Điều kiện lọc trên từng bản ghi (không dùng hàm tổng hợp ở WHERE).
* **GROUP BY**: Gom nhóm các bản ghi có cùng giá trị.
* **HAVING**: Điều kiện lọc sau khi đã gom nhóm (dùng kèm với hàm tổng hợp SUM, COUNT, AVG, MIN, MAX).
* **ORDER BY**: Sắp xếp kết quả (ASC: tăng dần, DESC: giảm dần).

### 3. Thao tác cập nhật dữ liệu:
* \`INSERT INTO table_name (col1, col2) VALUES (val1, val2);\`
* \`UPDATE table_name SET col1 = val1 WHERE condition;\`
* \`DELETE FROM table_name WHERE condition;\``,
    keyTakeaways: [
      'Thứ tự thực thi logic: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY.',
      'WHERE lọc trước khi nhóm, HAVING lọc sau khi nhóm (dành cho hàm gộp COUNT, SUM, AVG...).',
      'Toán tử LIKE kết hợp ký tự đại diện % (chuỗi bất kỳ) và _ (đúng 1 ký tự).'
    ],
    codeSnippets: [
      {
        language: 'sql',
        title: 'Ví dụ truy vấn thống kê điểm trung bình theo lớp',
        code: `SELECT MaLop, COUNT(MaHS) AS SoLuongHS, AVG(DiemTB) AS DiemTrungBinhLop
FROM HOC_SINH
WHERE DiemTB >= 5.0
GROUP BY MaLop
HAVING AVG(DiemTB) >= 8.0
ORDER BY DiemTrungBinhLop DESC;`
      }
    ],
    examTips: [
      'Bẫy rất hay gặp: Không được dùng hàm tổng hợp như WHERE COUNT(*) > 5, bắt buộc phải dùng HAVING COUNT(*) > 5.',
      'Nếu lệnh UPDATE hoặc DELETE không có mệnh đề WHERE, toàn bộ bảng sẽ bị thay đổi/xóa.'
    ],
    author: 'Tổ Chuyên Môn Tin Học THPT',
    updatedAt: '2025-01-25'
  },

  // CHỦ ĐỀ F (ĐỊNH HƯỚNG CS)
  {
    id: 'lesson_f1',
    topicId: 'topic_f',
    title: 'Bài 1: Lập trình Python nâng cao & Xử lý dữ liệu',
    order: 1,
    summary: 'Kiểu dữ liệu danh sách (List), từ điển (Dictionary), tập hợp (Set), hàm lambda, kỹ thuật List Comprehension và xử lý tệp tin trong Python.',
    contentMarkdown: `### 1. Kiểu dữ liệu nâng cao trong Python:
* **List (Danh sách)**: Có thứ tự, có thể thay đổi giá trị (mutable). Cú pháp: \`[1, 2, 3]\`.
* **Tuple**: Có thứ tự, không thể thay đổi giá trị (immutable). Cú pháp: \`(1, 2, 3)\`.
* **Set (Tập hợp)**: Không thứ tự, không chứa phần tử trùng lặp. Cú pháp: \`{1, 2, 3}\`.
* **Dictionary (Từ điển)**: Lưu cặp khóa - giá trị (\`key: value\`). Khóa là duy nhất và bất biến.

### 2. Kỹ thuật List Comprehension:
Tạo danh sách mới ngắn gọn và tối ưu:
\`\`\`python
# Lấy bình phương các số chẵn
evens_squared = [x**2 for x in range(10) if x % 2 == 0]
\`\`\`

### 3. Đọc và ghi tệp tin:
\`\`\`python
# Đọc file an toàn với context manager
with open('input.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()
\`\`\``,
    keyTakeaways: [
      'Dictionary tra cứu phần tử theo key với độ phức tạp trung bình O(1).',
      'List là mutable (thay đổi được), String và Tuple là immutable (không thay đổi được).',
      'Context manager \`with open(...)\` tự động đóng tệp khi kết thúc khối lệnh.'
    ],
    codeSnippets: [
      {
        language: 'python',
        title: 'Đếm tần suất xuất hiện ký tự bằng Dictionary',
        code: `def count_char_frequency(text: str) -> dict:
    freq = {}
    for char in text:
        if char != ' ':
            freq[char] = freq.get(char, 0) + 1
    return freq

print(count_char_frequency("tin hoc 12"))`
      }
    ],
    examTips: [
      'Chú ý chỉ số âm trong Python: text[-1] là phần tử cuối cùng.',
      'Hàm \`split()\` mặc định tách chuỗi theo khoảng trắng bất kỳ.'
    ],
    author: 'Tổ Chuyên Môn Tin Học THPT',
    updatedAt: '2025-01-26'
  },
  {
    id: 'lesson_f2',
    topicId: 'topic_f',
    title: 'Bài 2: Thuật toán Tìm kiếm và Sắp xếp',
    order: 2,
    summary: 'Thuật toán tìm kiếm nhị phân (Binary Search), sắp xếp nổi bọt (Bubble Sort), sắp xếp chèn (Insertion Sort), sắp xếp nhanh (Quick Sort) và đánh giá độ phức tạp thuật toán O(n).',
    contentMarkdown: `### 1. Thuật toán Tìm kiếm nhị phân (Binary Search)
* **Điều kiện áp dụng**: Dãy số ĐÃ ĐƯỢC SẮP XẾP.
* **Nguyên lý**: So sánh phần tử cần tìm với phần tử ở giữa (mid). Nếu bằng thì dừng, nếu nhỏ hơn thì tìm ở nửa trái, ngược lại tìm ở nửa phải.
* **Độ phức tạp thời gian**: $O(\\log n)$. Rất nhanh so với tìm kiếm tuần tự $O(n)$.

### 2. Các thuật toán sắp xếp cơ bản:
* **Sắp xếp nổi bọt (Bubble Sort)**: So sánh từng cặp phần tử liền kề và đổi chỗ nếu sai thứ tự. Độ phức tạp $O(n^2)$.
* **Sắp xếp chọn (Selection Sort)**: Liên tục tìm phần tử nhỏ nhất trong dãy chưa sắp xếp đưa về đầu. Độ phức tạp $O(n^2)$.
* **Sắp xếp nhanh (Quick Sort)**: Chọn phần tử chốt (pivot), phân hoạch mảng thành 2 nửa nhỏ hơn và lớn hơn pivot, gọi đệ quy. Độ phức tạp trung bình $O(n \\log n)$.`,
    keyTakeaways: [
      'Tìm kiếm nhị phân chỉ áp dụng cho mảng đã sắp xếp với độ phức tạp O(log n).',
      'Các thuật toán Bubble Sort, Selection Sort, Insertion Sort có độ phức tạp trung bình O(n²).',
      'Quick Sort và Merge Sort có độ phức tạp trung bình O(n log n).'
    ],
    codeSnippets: [
      {
        language: 'python',
        title: 'Cài đặt thuật toán Tìm kiếm nhị phân trong Python',
        code: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid  # Tìm thấy tại chỉ số mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1  # Không tìm thấy`
      }
    ],
    examTips: [
      'Đề thi hay hỏi số lần so sánh tối đa của Binary Search với mảng có n phần tử (xấp xỉ log2(n) + 1).',
      'Ví dụ với n = 1000 phần tử, Binary Search chỉ cần tối đa khoảng 10 phép so sánh.'
    ],
    author: 'Tổ Chuyên Môn Tin Học THPT',
    updatedAt: '2025-01-28'
  },

  // CHỦ ĐỀ G
  {
    id: 'lesson_g1',
    topicId: 'topic_g',
    title: 'Bài 1: Hướng nghiệp trong lĩnh vực Công nghệ thông tin',
    order: 1,
    summary: 'Tổng quan các nhóm nghề nghiệp trong ngành CNTT: Phát triển phần mềm, Khoa học dữ liệu, An toàn thông tin, Kỹ sư mạng và Thiết kế hệ thống.',
    contentMarkdown: `### 1. Nhóm ngành nghề Phát triển phần mềm:
* Lập trình viên Front-end / Back-end / Full-stack / Mobile app.
* Kỹ sư kiểm thử chất lượng phần mềm (QA / QC Tester).
* Kiến trúc sư giải pháp phần mềm (Software Architect).

### 2. Nhóm ngành nghề Dữ liệu và AI:
* Kỹ sư dữ liệu (Data Engineer): Xây dựng đường ống thu thập và xử lý dữ liệu lớn.
* Nhà khoa học dữ liệu (Data Scientist): Phân tích số liệu, huấn luyện mô hình dự báo.
* Kỹ sư AI / Machine Learning (AI Engineer).

### 3. Nhóm ngành nghề Mạng và An ninh mạng:
* Quản trị hệ thống mạng (Network Administrator).
* Chuyên gia an toàn thông tin & phòng thủ mạng (Cybersecurity Specialist / SOC Analyst).`,
    keyTakeaways: [
      'Ngành CNTT bao gồm nhiều nhánh chuyên sâu: Lập trình, Dữ liệu & AI, An ninh mạng, Quản trị hệ thống.',
      'Cần trang bị tư duy logic, kỹ năng tự học suốt đời và khả năng làm việc nhóm để đáp ứng nhu cầu thị trường số.'
    ],
    examTips: [
      'Phân biệt rõ vai trò của Data Scientist (phân tích, mô hình) và Data Engineer (xây dựng hạ tầng dữ liệu).'
    ],
    author: 'Tổ Chuyên Môn Tin Học THPT',
    updatedAt: '2025-01-29'
  }
];
