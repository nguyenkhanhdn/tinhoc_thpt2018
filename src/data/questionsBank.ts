import { Question } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  // ==========================================
  // PHẦN I: TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (24 CÂU ĐIỂN HÌNH CHUẨN ĐỀ BỘ)
  // ==========================================

  // 1. Chủ đề A - Hệ điều hành
  {
    id: 'q1',
    topicId: 'topic_a',
    lessonId: 'lesson_a1',
    lessonTitle: 'Bài 1: Hệ điều hành và Phần mềm ứng dụng',
    type: 'single_choice',
    content: 'Phát biểu nào sau đây nêu ĐÚNG chức năng cốt lõi của Hệ điều hành?',
    options: [
      'Là phần mềm ứng dụng chuyên dùng để soạn thảo văn bản và tính toán bảng tính.',
      'Là môi trường trung gian quản lý tài nguyên phần cứng và cung cấp dịch vụ cho các phần mềm khác hoạt động.',
      'Là thiết bị vật lý kết nối máy tính vào mạng Internet toàn cầu.',
      'Là phần mềm tiện ích chỉ có nhiệm vụ quét và tiêu diệt virus máy tính.'
    ],
    correctAnswer: 'B',
    explanation: 'Hệ điều hành (Operating System) là phần mềm hệ thống giữ vai trò trung gian điều phối tài nguyên phần cứng (CPU, RAM, thiết bị I/O) và cung cấp môi trường để các phần mềm ứng dụng vận hành.',
    cognitiveLevel: 'NB',
    track: 'CORE',
    source: 'Đề minh họa Tốt nghiệp THPT Quốc gia 2025'
  },
  {
    id: 'q2',
    topicId: 'topic_a',
    lessonId: 'lesson_a1',
    lessonTitle: 'Bài 1: Hệ điều hành và Phần mềm ứng dụng',
    type: 'single_choice',
    content: 'Hệ điều hành nào sau đây thuộc loại hệ điều hành mã nguồn mở?',
    options: [
      'Microsoft Windows 11',
      'Apple macOS Sequoia',
      'Ubuntu Linux',
      'Apple iOS 18'
    ],
    correctAnswer: 'C',
    explanation: 'Ubuntu Linux được phát triển dựa trên nhân Linux và phát hành theo giấy phép mã nguồn mở (GPL), cho phép người dùng tự do xem, sửa đổi và phân phối lại mã nguồn.',
    cognitiveLevel: 'NB',
    track: 'CORE',
    source: 'Đề thi thử THPT Chuyên Sư Phạm Hà Nội'
  },
  {
    id: 'q3',
    topicId: 'topic_a',
    lessonId: 'lesson_a2',
    lessonTitle: 'Bài 2: Trí tuệ nhân tạo (AI) và Ứng dụng thực tiễn',
    type: 'single_choice',
    content: 'Mối quan hệ phân cấp nào sau đây giữa AI, Học máy (Machine Learning) và Học sâu (Deep Learning) là ĐÚNG?',
    options: [
      'Deep Learning bao gồm Machine Learning, và Machine Learning bao gồm AI.',
      'AI bao gồm Machine Learning, và Machine Learning bao gồm Deep Learning.',
      'AI và Machine Learning là hai khái niệm độc lập, Deep Learning nằm ngoài cả hai.',
      'Machine Learning bao gồm cả AI và Deep Learning.'
    ],
    correctAnswer: 'B',
    explanation: 'AI là tập hợp lớn nhất về trí tuệ nhân tạo. Trong đó Machine Learning là một tập con của AI, và Deep Learning (Mạng nơ-ron sâu) là một tập con chuyên sâu của Machine Learning.',
    cognitiveLevel: 'TH',
    track: 'CORE',
    source: 'Đề tham khảo Tốt nghiệp THPT 2025'
  },
  {
    id: 'q4',
    topicId: 'topic_a',
    lessonId: 'lesson_a2',
    lessonTitle: 'Bài 2: Trí tuệ nhân tạo (AI) và Ứng dụng thực tiễn',
    type: 'single_choice',
    content: 'Ứng dụng nào sau đây KHÔNG phải là ứng dụng tiêu biểu của Trí tuệ nhân tạo (AI)?',
    options: [
      'Hệ thống xe tự hành phát hiện biển báo và chướng ngại vật theo thời gian thực.',
      'Phần mềm sao chép tệp tin từ ổ đĩa C sang ổ cứng gắn ngoài theo lệnh người dùng.',
      'Hệ thống tự động dịch thuật và tổng hợp giọng nói đa ngôn ngữ.',
      'Hệ thống y tế phân tích ảnh chụp X-quang hỗ trợ chẩn đoán phát hiện khối u.'
    ],
    correctAnswer: 'B',
    explanation: 'Sao chép tệp tin theo lệnh người dùng là thao tác vào/ra tệp tin tuần tự của hệ điều hành thông thường, không đòi hỏi thuật toán học máy hay trí tuệ nhân tạo suy luận.',
    cognitiveLevel: 'TH',
    track: 'CORE',
    source: 'Đề thi thử THPT Chuyên Lê Hồng Phong'
  },

  // 2. Chủ đề B - Mạng máy tính & An toàn thông tin
  {
    id: 'q5',
    topicId: 'topic_b',
    lessonId: 'lesson_b1',
    lessonTitle: 'Bài 1: Kiến trúc Mạng máy tính và Giao thức TCP/IP',
    type: 'single_choice',
    content: 'Địa chỉ IPv4 gồm bao nhiêu bit và thường được biểu diễn thành mấy nhóm số thập phân?',
    options: [
      '16 bit, biểu diễn thành 2 nhóm số thập phân.',
      '32 bit, biểu diễn thành 4 nhóm số thập phân cách nhau bằng dấu chấm.',
      '64 bit, biểu diễn thành 8 nhóm số thập phân.',
      '128 bit, biểu diễn thành 8 nhóm số thập lục phân.'
    ],
    correctAnswer: 'B',
    explanation: 'Địa chỉ IPv4 có độ dài 32 bit (tương đương 4 byte), được viết dưới dạng 4 số thập phân từ 0 đến 255 cách nhau bởi dấu chấm (ví dụ: 192.168.1.1).',
    cognitiveLevel: 'NB',
    track: 'CORE',
    source: 'Đề minh họa Tốt nghiệp THPT 2025'
  },
  {
    id: 'q6',
    topicId: 'topic_b',
    lessonId: 'lesson_b1',
    lessonTitle: 'Bài 1: Kiến trúc Mạng máy tính và Giao thức TCP/IP',
    type: 'single_choice',
    content: 'Thiết bị mạng nào sau đây có chức năng định tuyến các gói tin giữa các mạng máy tính khác nhau?',
    options: [
      'Hub (Bộ tập trung)',
      'Switch (Bộ chuyển mạch trong mạng LAN)',
      'Router (Bộ định tuyến)',
      'Repeater (Bộ lặp tín hiệu)'
    ],
    correctAnswer: 'C',
    explanation: 'Router (Bộ định tuyến) hoạt động ở tầng Mạng (Network Layer), có nhiệm vụ tìm đường tối ưu và chuyển tiếp gói tin giữa các mạng IP độc lập.',
    cognitiveLevel: 'TH',
    track: 'CORE',
    source: 'Đề tham khảo Khảo thí Quốc gia'
  },
  {
    id: 'q7',
    topicId: 'topic_b',
    lessonId: 'lesson_b1',
    lessonTitle: 'Bài 1: Kiến trúc Mạng máy tính và Giao thức TCP/IP',
    type: 'single_choice',
    content: 'Hệ thống dịch vụ mạng DNS (Domain Name System) có vai trò chính là gì?',
    options: [
      'Mã hóa toàn bộ đường truyền dữ liệu giữa máy khách và máy chủ.',
      'Chuyển đổi tên miền thân thiện (ví dụ: edu.vn) sang địa chỉ IP máy chủ (ví dụ: 203.162.0.11).',
      'Cấp phát địa chỉ IP động tự động cho các thiết bị khi vào mạng Wi-Fi.',
      'Chặn các trang web có nội dung độc hại trên tường lửa.'
    ],
    correctAnswer: 'B',
    explanation: 'DNS đóng vai trò như danh bạ Internet, giúp phân giải tên miền dạng chữ dễ nhớ thành địa chỉ IP số học để thiết bị mạng giao tiếp.',
    cognitiveLevel: 'TH',
    track: 'CORE',
    source: 'Đề thi thử THPT Quốc gia 2025'
  },
  {
    id: 'q8',
    topicId: 'topic_b',
    lessonId: 'lesson_b2',
    lessonTitle: 'Bài 2: An toàn thông tin và Phòng chống mã độc',
    type: 'single_choice',
    content: 'Loại mã độc hại nào tự động mã hóa dữ liệu trên thiết bị của nạn nhân và hiển thị thông báo đòi tiền chuộc để giải mã?',
    options: [
      'Trojan Horse',
      'Ransomware',
      'Spyware (Phần mềm gián điệp)',
      'Adware (Phần mềm quảng cáo phiền toái)'
    ],
    correctAnswer: 'B',
    explanation: 'Ransomware (mã độc tống tiền) sử dụng các thuật toán mã hóa mạnh để khóa tệp tin của người dùng và yêu cầu chuyển tiền chuộc (thường là tiền kỹ thuật số) để lấy khóa giải mã.',
    cognitiveLevel: 'NB',
    track: 'CORE',
    source: 'Đề tham khảo Tốt nghiệp THPT 2025'
  },

  // 3. Chủ đề D - Đạo đức & Pháp luật số
  {
    id: 'q9',
    topicId: 'topic_d',
    lessonId: 'lesson_d1',
    lessonTitle: 'Bài 1: Pháp luật, Bản quyền số và Văn hóa ứng xử số',
    type: 'single_choice',
    content: 'Hành vi nào sau đây là hành vi VI PHẠM pháp luật về bản quyền và sở hữu trí tuệ phần mềm?',
    options: [
      'Cài đặt phần mềm mã nguồn mở Linux Ubuntu theo giấy phép GPL.',
      'Tải bản phân phối miễn phí của trình soạn thảo VS Code từ trang chủ chính thức.',
      'Bẻ khóa (crack) phần mềm thương mại có bản quyền và phát tán mã kích hoạt lên mạng.',
      'Sử dụng phần mềm dùng thử miễn phí (Trial) trong thời hạn cho phép của nhà sản xuất.'
    ],
    correctAnswer: 'C',
    explanation: 'Hành vi bẻ khóa và chia sẻ mã bản quyền lậu xâm phạm quyền tác giả của tổ chức/cá nhân sở hữu phần mềm và vi phạm Luật Sở hữu trí tuệ cũng như Luật An ninh mạng.',
    cognitiveLevel: 'TH',
    track: 'CORE',
    source: 'Đề thi thử THPT Chuyên Quốc Học Huế'
  },
  {
    id: 'q10',
    topicId: 'topic_d',
    lessonId: 'lesson_d1',
    lessonTitle: 'Bài 1: Pháp luật, Bản quyền số và Văn hóa ứng xử số',
    type: 'single_choice',
    content: 'Khi tham gia giao tiếp và chia sẻ thông tin trên mạng xã hội, hành động nào sau đây thể hiện văn hóa số văn minh, đúng pháp luật?',
    options: [
      'Chia sẻ ngay các thông tin giật gân, chưa được kiểm chứng từ các trang không rõ nguồn gốc.',
      'Tôn trọng bản quyền tác giả, dẫn nguồn rõ ràng khi trích dẫn tài liệu và bảo vệ quyền riêng tư người khác.',
      'Sử dụng tài khoản ẩn danh để công kích, hạ uy tín cá nhân của bạn cùng lớp.',
      'Thu thập trái phép hình ảnh và số điện thoại của người khác để tạo danh sách quảng cáo.'
    ],
    correctAnswer: 'B',
    explanation: 'Tôn trọng quyền tác giả, dẫn nguồn trung thực và bảo vệ thông tin riêng tư là chuẩn mực đạo đức và pháp luật cốt lõi trong không gian số.',
    cognitiveLevel: 'TH',
    track: 'CORE',
    source: 'Đề minh họa Tốt nghiệp THPT 2025'
  },

  // 4. Chủ đề E - CSDL & SQL (Định hướng ICT)
  {
    id: 'q11',
    topicId: 'topic_e',
    lessonId: 'lesson_e1',
    lessonTitle: 'Bài 1: Cơ sở dữ liệu quan hệ và Mô hình dữ liệu quan hệ',
    type: 'single_choice',
    content: 'Trong mô hình dữ liệu quan hệ, phát biểu nào sau đây về Khóa chính (Primary Key) là ĐÚNG?',
    options: [
      'Một bảng có thể có nhiều khóa chính độc lập.',
      'Khóa chính có thể chứa các giá trị trùng lặp nhau giữa các hàng.',
      'Khóa chính giúp phân biệt duy nhất từng bản ghi trong bảng và KHÔNG được nhận giá trị rỗng (NULL).',
      'Khóa chính bắt buộc phải có kiểu dữ liệu là số nguyên tự tăng.'
    ],
    correctAnswer: 'C',
    explanation: 'Theo tính toàn vẹn thực thể trong mô hình quan hệ, khóa chính xác định duy nhất mỗi bộ (bản ghi), không được chứa giá trị trùng lặp và không được mang giá trị rỗng (NOT NULL).',
    cognitiveLevel: 'TH',
    track: 'ICT',
    source: 'Đề thi thử THPT Chuyên Lam Sơn'
  },
  {
    id: 'q12',
    topicId: 'topic_e',
    lessonId: 'lesson_e1',
    lessonTitle: 'Bài 1: Cơ sở dữ liệu quan hệ và Mô hình dữ liệu quan hệ',
    type: 'single_choice',
    content: 'Khóa ngoại (Foreign Key) trong một bảng quan hệ có vai trò chính là gì?',
    options: [
      'Tăng tốc độ khởi động hệ quản trị cơ sở dữ liệu.',
      'Liên kết với khóa chính của bảng khác nhằm đảm bảo tính toàn vẹn tham chiếu dữ liệu.',
      'Tự động sao lưu dữ liệu sang máy chủ dự phòng.',
      'Mã hóa các trường dữ liệu quan trọng như mật khẩu người dùng.'
    ],
    correctAnswer: 'B',
    explanation: 'Khóa ngoại trỏ tới khóa chính của bảng quan hệ cha nhằm thiết lập mối liên kết (1-1 hoặc 1-N) và bảo toàn tính toàn vẹn tham chiếu.',
    cognitiveLevel: 'TH',
    track: 'ICT',
    source: 'Đề minh họa Tốt nghiệp THPT 2025'
  },
  {
    id: 'q13',
    topicId: 'topic_e',
    lessonId: 'lesson_e2',
    lessonTitle: 'Bài 2: Ngôn ngữ truy vấn dữ liệu SQL (DML & DDL)',
    type: 'single_choice',
    content: 'Cho câu lệnh SQL sau:\nSELECT HoTen, DiemTB FROM HOC_SINH WHERE DiemTB >= 8.0 ORDER BY DiemTB DESC;\nÝ nghĩa chính xác của câu lệnh trên là gì?',
    options: [
      'Hiển thị tất cả học sinh có điểm trung bình từ 8.0 trở lên, sắp xếp điểm từ thấp đến cao.',
      'Hiển thị họ tên và điểm trung bình của học sinh có điểm từ 8.0 trở lên, sắp xếp điểm giảm dần (từ cao xuống thấp).',
      'Đếm tổng số học sinh đạt điểm 8.0 trong bảng học sinh.',
      'Cập nhật điểm trung bình của học sinh thành 8.0 theo thứ tự giảm dần.'
    ],
    correctAnswer: 'B',
    explanation: 'Mệnh đề WHERE DiemTB >= 8.0 lọc học sinh đạt từ 8.0 trở lên, và ORDER BY DiemTB DESC thực hiện sắp xếp theo thứ tự giảm dần (Descending).',
    cognitiveLevel: 'TH',
    track: 'ICT',
    source: 'Đề thi thử THPT Chuyên Phan Bội Châu'
  },
  {
    id: 'q14',
    topicId: 'topic_e',
    lessonId: 'lesson_e2',
    lessonTitle: 'Bài 2: Ngôn ngữ truy vấn dữ liệu SQL (DML & DDL)',
    type: 'single_choice',
    content: 'Trong câu lệnh SQL SELECT có gom nhóm (GROUP BY), mệnh đề nào được dùng để đặt điều kiện lọc trên các giá trị của HÀM TỔNG HỢP (như COUNT, SUM, AVG)?',
    options: [
      'WHERE',
      'HAVING',
      'ORDER BY',
      'DISTINCT'
    ],
    correctAnswer: 'B',
    explanation: 'Mệnh đề WHERE chỉ lọc trên từng bản ghi thô trước khi gom nhóm, trong khi HAVING lọc dữ liệu sau khi đã gom nhóm và hỗ trợ điều kiện trên các hàm tổng hợp như HAVING AVG(Diem) >= 8.0.',
    cognitiveLevel: 'TH',
    track: 'ICT',
    source: 'Đề tham khảo Tốt nghiệp THPT 2025'
  },
  {
    id: 'q15',
    topicId: 'topic_e',
    lessonId: 'lesson_e2',
    lessonTitle: 'Bài 2: Ngôn ngữ truy vấn dữ liệu SQL (DML & DDL)',
    type: 'single_choice',
    content: 'Lệnh SQL nào sau đây dùng để XÓA các bản ghi thỏa mãn điều kiện nhất định khỏi bảng dữ liệu?',
    options: [
      'REMOVE FROM table_name WHERE condition;',
      'DROP TABLE table_name;',
      'DELETE FROM table_name WHERE condition;',
      'CLEAR FROM table_name WHERE condition;'
    ],
    correctAnswer: 'C',
    explanation: 'Cú pháp chuẩn của SQL để xóa bản ghi trong bảng là DELETE FROM <table> WHERE <điều_kiện>. (Lưu ý: DROP TABLE dùng để xóa toàn bộ cấu trúc bảng).',
    cognitiveLevel: 'NB',
    track: 'ICT',
    source: 'Đề thi khảo thí THPT 2025'
  },
  {
    id: 'q16',
    topicId: 'topic_e',
    lessonId: 'lesson_e2',
    lessonTitle: 'Bài 2: Ngôn ngữ truy vấn dữ liệu SQL (DML & DDL)',
    type: 'single_choice',
    content: 'Để cập nhật cột DonGia tăng thêm 10% cho các sản phẩm có LoaiSP = "DienTu" trong bảng SAN_PHAM, câu lệnh SQL nào sau đây là ĐÚNG?',
    options: [
      'UPDATE SAN_PHAM SET DonGia = DonGia * 1.1 WHERE LoaiSP = "DienTu";',
      'MODIFY SAN_PHAM SET DonGia = DonGia * 1.1 WHERE LoaiSP = "DienTu";',
      'ALTER TABLE SAN_PHAM UPDATE DonGia = DonGia * 1.1;',
      'INSERT INTO SAN_PHAM (DonGia) VALUES (DonGia * 1.1) WHERE LoaiSP = "DienTu";'
    ],
    correctAnswer: 'A',
    explanation: 'Lệnh UPDATE <Bảng> SET <Cột> = <Giá trị mới> WHERE <Điều kiện> là cú pháp chuẩn của ngôn ngữ thao tác dữ liệu (DML) trong SQL.',
    cognitiveLevel: 'VD',
    track: 'ICT',
    source: 'Đề thi thử THPT Chuyên Khoa học Tự nhiên'
  },

  // 5. Chủ đề F - Lập trình & Thuật toán (Định hướng CS)
  {
    id: 'q17',
    topicId: 'topic_f',
    lessonId: 'lesson_f1',
    lessonTitle: 'Bài 1: Lập trình Python nâng cao & Xử lý dữ liệu',
    type: 'single_choice',
    content: 'Đoạn mã Python sau in ra kết quả là gì?\nnums = [1, 2, 3, 4, 5]\nres = [x * 2 for x in nums if x % 2 != 0]\nprint(res)',
    options: [
      '[2, 4, 6, 8, 10]',
      '[2, 6, 10]',
      '[4, 8]',
      '[1, 3, 5]'
    ],
    correctAnswer: 'B',
    explanation: 'Điều kiện `if x % 2 != 0` lọc các số lẻ trong nums: [1, 3, 5]. Sau đó nhân 2 mỗi phần tử: 1*2=2, 3*2=6, 5*2=10. Kết quả là [2, 6, 10].',
    cognitiveLevel: 'VD',
    track: 'CS',
    source: 'Đề minh họa Tốt nghiệp THPT 2025'
  },
  {
    id: 'q18',
    topicId: 'topic_f',
    lessonId: 'lesson_f1',
    lessonTitle: 'Bài 1: Lập trình Python nâng cao & Xử lý dữ liệu',
    type: 'single_choice',
    content: 'Trong Python, cấu trúc dữ liệu Dictionary (từ điển) lưu trữ dữ liệu dưới dạng nào và phần tử được truy xuất thông qua gì?',
    options: [
      'Chỉ lưu các giá trị duy nhất, truy xuất bằng chỉ số số nguyên 0, 1, 2...',
      'Lưu trữ cặp khóa - giá trị (Key - Value), truy xuất giá trị thông qua Khóa (Key).',
      'Lưu trữ theo cấu trúc ngăn xếp LIFO, truy xuất bằng hàm pop().',
      'Lưu trữ mảng 2 chiều cố định, không thể thêm bớt phần tử.'
    ],
    correctAnswer: 'B',
    explanation: 'Dictionary trong Python là bảng băm (hash map) lưu cặp Key: Value. Key là duy nhất và bất biến (immutable), cho phép truy xuất giá trị tương ứng với độ phức tạp trung bình O(1).',
    cognitiveLevel: 'TH',
    track: 'CS',
    source: 'Đề thi thử THPT Chuyên Hà Nội - Amsterdam'
  },
  {
    id: 'q19',
    topicId: 'topic_f',
    lessonId: 'lesson_f2',
    lessonTitle: 'Bài 2: Thuật toán Tìm kiếm và Sắp xếp',
    type: 'single_choice',
    content: 'Điều kiện TIÊN QUYẾT để áp dụng thuật toán Tìm kiếm nhị phân (Binary Search) trên một mảng là gì?',
    options: [
      'Mảng phải chứa toàn số nguyên dương.',
      'Mảng phải có số lượng phần tử là một lũy thừa của 2.',
      'Mảng phải được sắp xếp theo thứ tự tăng dần hoặc giảm dần.',
      'Mảng không được chứa bất kỳ phần tử nào trùng lặp.'
    ],
    correctAnswer: 'C',
    explanation: 'Thuật toán tìm kiếm nhị phân dựa trên tính chất chia đôi miền tìm kiếm dựa vào so sánh với phần tử ở giữa, do đó mảng bắt buộc phải được sắp xếp thứ tự trước.',
    cognitiveLevel: 'NB',
    track: 'CS',
    source: 'Đề tham khảo Tốt nghiệp THPT 2025'
  },
  {
    id: 'q20',
    topicId: 'topic_f',
    lessonId: 'lesson_f2',
    lessonTitle: 'Bài 2: Thuật toán Tìm kiếm và Sắp xếp',
    type: 'single_choice',
    content: 'Độ phức tạp thời gian trong trường hợp xấu nhất của thuật toán Tìm kiếm nhị phân (Binary Search) trên mảng n phần tử là bao nhiêu?',
    options: [
      'O(1)',
      'O(log n)',
      'O(n)',
      'O(n²)'
    ],
    correctAnswer: 'B',
    explanation: 'Sau mỗi bước so sánh, miền tìm kiếm giảm đi một nửa, do đó số bước thực hiện tối đa tỷ lệ thuận với log2(n), tức độ phức tạp O(log n).',
    cognitiveLevel: 'TH',
    track: 'CS',
    source: 'Đề thi thử THPT Quốc gia 2025'
  },
  {
    id: 'q21',
    topicId: 'topic_f',
    lessonId: 'lesson_f2',
    lessonTitle: 'Bài 2: Thuật toán Tìm kiếm và Sắp xếp',
    type: 'single_choice',
    content: 'Cho mảng A = [12, 5, 8, 3, 1]. Nếu áp dụng thuật toán Sắp xếp nổi bọt (Bubble Sort) để sắp xếp tăng dần, sau LƯỢT DUYỆT THỨ NHẤT (Pass 1), mảng A có trạng thái là gì?',
    options: [
      '[1, 5, 8, 3, 12]',
      '[5, 8, 3, 1, 12]',
      '[1, 3, 5, 8, 12]',
      '[5, 12, 8, 3, 1]'
    ],
    correctAnswer: 'B',
    explanation: 'Trong Bubble Sort, các phần tử lớn sẽ liên tục nổi về phía cuối. So sánh (12,5)->[5,12,8,3,1], (12,8)->[5,8,12,3,1], (12,3)->[5,8,3,12,1], (12,1)->[5,8,3,1,12]. Kết thúc pass 1, số lớn nhất là 12 về đúng vị trí cuối.',
    cognitiveLevel: 'VD',
    track: 'CS',
    source: 'Đề thi thử THPT Chuyên Sư Phạm'
  },
  {
    id: 'q22',
    topicId: 'topic_f',
    lessonId: 'lesson_f1',
    lessonTitle: 'Bài 1: Lập trình Python nâng cao & Xử lý dữ liệu',
    type: 'single_choice',
    content: 'Cho hàm đệ quy sau trong Python:\ndef f(n):\n    if n <= 1:\n        return 1\n    return n * f(n - 1)\n\nGiá trị của lời gọi hàm f(4) là bao nhiêu?',
    options: [
      '10',
      '24',
      '16',
      '12'
    ],
    correctAnswer: 'B',
    explanation: 'Hàm tính giai thừa: f(4) = 4 * f(3) = 4 * (3 * f(2)) = 4 * 3 * (2 * f(1)) = 4 * 3 * 2 * 1 = 24.',
    cognitiveLevel: 'VD',
    track: 'CS',
    source: 'Đề minh họa Tốt nghiệp THPT 2025'
  },

  // 6. Chủ đề G - Hướng nghiệp
  {
    id: 'q23',
    topicId: 'topic_g',
    lessonId: 'lesson_g1',
    lessonTitle: 'Bài 1: Hướng nghiệp trong lĩnh vực Công nghệ thông tin',
    type: 'single_choice',
    content: 'Vị trí công việc nào sau đây chịu trách nhiệm chính trong việc thiết kế cơ sở dữ liệu, xây dựng API và xử lý logic nghiệp vụ phía máy chủ cho ứng dụng web?',
    options: [
      'Front-end Developer',
      'Back-end Developer',
      'UI/UX Designer',
      'Technical Writer'
    ],
    correctAnswer: 'B',
    explanation: 'Back-end Developer phụ trách hạ tầng server, API, cơ sở dữ liệu và bảo mật nghiệp vụ; trong khi Front-end đảm nhiệm giao diện tương tác người dùng.',
    cognitiveLevel: 'NB',
    track: 'CORE',
    source: 'Đề minh họa Tốt nghiệp THPT 2025'
  },
  {
    id: 'q24',
    topicId: 'topic_g',
    lessonId: 'lesson_g1',
    lessonTitle: 'Bài 1: Hướng nghiệp trong lĩnh vực Công nghệ thông tin',
    type: 'single_choice',
    content: 'Trong thời đại chuyển đổi số và phát triển AI, kỹ năng nào sau đây là kỹ năng bổ trợ ĐẶC BIỆT quan trọng đối với người làm nghề Tin học?',
    options: [
      'Khả năng ghi nhớ thủ công toàn bộ các hàm thư viện mà không cần tra cứu tài liệu.',
      'Tư duy giải quyết vấn đề, năng lực tự học công nghệ mới và kỹ năng làm việc cộng tác.',
      'Chỉ làm việc độc lập và từ chối sử dụng các công cụ trí tuệ nhân tạo hỗ trợ lập trình.',
      'Hạn chế cập nhật các phiên bản ngôn ngữ lập trình mới để giữ an toàn.'
    ],
    correctAnswer: 'B',
    explanation: 'Công nghệ thay đổi rất nhanh, năng lực tự học suốt đời, tư duy thuật toán và kỹ năng giao tiếp/hợp tác nhóm là yếu tố then chốt để thành công.',
    cognitiveLevel: 'TH',
    track: 'CORE',
    source: 'Đề thi khảo thí THPT 2025'
  },

  // ==========================================
  // PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI (4 CÂU ĐA Ý A, B, C, D THEO CHUẨN BỘ GD&ĐT)
  // ==========================================

  // Câu 1 Phần II: Chủ đề A & B (Hệ điều hành & Mạng)
  {
    id: 'q25_tf1',
    topicId: 'topic_b',
    lessonId: 'lesson_b1',
    lessonTitle: 'Bài 1: Kiến trúc Mạng máy tính và Giao thức TCP/IP',
    type: 'true_false',
    content: 'Trong buổi thực hành lắp đặt và cấu hình mạng máy tính cho phòng học Tin học tại trường THPT, giáo viên yêu cầu kết nối 30 máy tính học sinh vào mạng nội bộ (LAN) và kết nối ra Internet qua đường truyền cáp quang của nhà mạng.',
    subQuestions: [
      {
        id: 'q25_a',
        label: 'a',
        statement: 'Để kết nối tất cả 30 máy tính trong phòng thực hành vào cùng một mạng cục bộ (LAN), nhà trường có thể sử dụng các thiết bị Switch (Bộ chuyển mạch).',
        isCorrect: true,
        explanation: 'Đúng, Switch là thiết bị trung tâm trong mạng LAN giúp chuyển tiếp các khung dữ liệu (frame) tới đúng cổng máy nhận.'
      },
      {
        id: 'q25_b',
        label: 'b',
        statement: 'Địa chỉ IPv4 "192.168.1.300" là một địa chỉ IP hợp lệ có thể gán cho máy tính của học sinh.',
        isCorrect: false,
        explanation: 'Sai, mỗi byte trong địa chỉ IPv4 chỉ nhận giá trị từ 0 đến 255. Giá trị 300 vượt quá giới hạn 255.'
      },
      {
        id: 'q25_c',
        label: 'c',
        statement: 'Router (Bộ định tuyến) có chức năng định tuyến và chuyển tiếp các gói tin giữa mạng LAN của trường học và mạng Internet công cộng bên ngoài.',
        isCorrect: true,
        explanation: 'Đúng, Router là thiết bị kết nối các mạng logic khác nhau và định tuyến dữ liệu ra Internet.'
      },
      {
        id: 'q25_d',
        label: 'd',
        statement: 'Giao thức HTTPS trên trình duyệt web máy tính học sinh sử dụng cơ chế truyền thông không mã hóa, hoàn toàn giống với giao thức HTTP truyền thống.',
        isCorrect: false,
        explanation: 'Sai, HTTPS kết hợp HTTP với giao thức bảo mật SSL/TLS để mã hóa dữ liệu truyền trên mạng, đảm bảo tính bí mật và toàn vẹn.'
      }
    ],
    explanation: 'Cấu trúc mạng LAN yêu cầu Switch để kết nối nội bộ, Router để định tuyến ra ngoài Internet; địa chỉ IPv4 nằm trong khoảng 0-255 mỗi octet và HTTPS được mã hóa an toàn.',
    cognitiveLevel: 'VD',
    track: 'CORE',
    source: 'Đề minh họa Tốt nghiệp THPT 2025 - Phần II'
  },

  // Câu 2 Phần II: Chủ đề E (Cơ sở dữ liệu quan hệ)
  {
    id: 'q26_tf2',
    topicId: 'topic_e',
    lessonId: 'lesson_e1',
    lessonTitle: 'Bài 1: Cơ sở dữ liệu quan hệ và Mô hình dữ liệu quan hệ',
    type: 'true_false',
    content: 'Một trường THPT xây dựng Cơ sở dữ liệu quản lý điểm thi tốt nghiệp gồm 2 bảng:\n- Bảng HOC_SINH(MaHS, HoTen, NgaySinh, GioiTinh, MaLop)\n- Bảng KET_QUA_THI(MaHS, MonThi, DiemThi, LanThi)\nTrong đó MaHS là khóa chính của bảng HOC_SINH, và trường MaHS ở bảng KET_QUA_THI là khóa ngoại tham chiếu tới MaHS của bảng HOC_SINH.',
    subQuestions: [
      {
        id: 'q26_a',
        label: 'a',
        statement: 'Khóa chính MaHS trong bảng HOC_SINH có thể nhận giá trị NULL đối với những học sinh chưa có thẻ căn cước.',
        isCorrect: false,
        explanation: 'Sai, theo tính toàn vẹn thực thể, Khóa chính tuyệt đối KHÔNG được mang giá trị NULL.'
      },
      {
        id: 'q26_b',
        label: 'b',
        statement: 'Để tránh trùng lặp bản ghi, khóa chính của bảng KET_QUA_THI có thể là tổ hợp gồm 3 trường: (MaHS, MonThi, LanThi).',
        isCorrect: true,
        explanation: 'Đúng, tổ hợp (MaHS, MonThi, LanThi) xác định duy nhất điểm thi của 1 học sinh ở 1 môn thi trong một lần thi cụ thể.'
      },
      {
        id: 'q26_c',
        label: 'c',
        statement: 'Hệ quản trị CSDL sẽ báo lỗi toàn vẹn tham chiếu nếu ta chèn một bản ghi điểm thi vào bảng KET_QUA_THI với MaHS chưa từng tồn tại trong bảng HOC_SINH.',
        isCorrect: true,
        explanation: 'Đúng, quy tắc khóa ngoại bắt buộc giá trị của khóa ngoại phải tồn tại ở bảng cha hoặc là NULL.'
      },
      {
        id: 'q26_d',
        label: 'd',
        statement: 'Khi xóa bảng HOC_SINH, bảng KET_QUA_THI sẽ tự động chuyển thành bảng không có dữ liệu mà không chịu bất kỳ ràng buộc nào.',
        isCorrect: false,
        explanation: 'Sai, hệ quản trị CSDL sẽ ngăn chặn xóa bảng cha HOC_SINH khi đang có khóa ngoại từ bảng con KET_QUA_THI tham chiếu tới (trừ khi có thiết lập CASCADE).'
      }
    ],
    explanation: 'Mô hình quan hệ tuân thủ chặt chẽ ràng buộc toàn vẹn thực thể (Khóa chính NOT NULL) và toàn vẹn tham chiếu (Khóa ngoại phải hợp lệ).',
    cognitiveLevel: 'VD',
    track: 'ICT',
    source: 'Đề minh họa Tốt nghiệp THPT 2025 - Phần II'
  },

  // Câu 3 Phần II: Chủ đề E - SQL Truy vấn dữ liệu
  {
    id: 'q27_tf3',
    topicId: 'topic_e',
    lessonId: 'lesson_e2',
    lessonTitle: 'Bài 2: Ngôn ngữ truy vấn dữ liệu SQL (DML & DDL)',
    type: 'true_false',
    content: 'Xét bảng dữ liệu HOC_SINH có các cột: MaHS, HoTen, MaLop, DiemToan, DiemTin, DiemVan. Giáo viên Tin học viết các câu truy vấn SQL để thống kê học tập.',
    subQuestions: [
      {
        id: 'q27_a',
        label: 'a',
        statement: 'Câu lệnh "SELECT * FROM HOC_SINH WHERE DiemTin >= 9.0;" sẽ trả về tất cả các cột của các học sinh có điểm Tin học đạt từ 9.0 trở lên.',
        isCorrect: true,
        explanation: 'Đúng, ký tự * đại diện cho việc lấy tất cả các cột trong bảng.'
      },
      {
        id: 'q27_b',
        label: 'b',
        statement: 'Câu lệnh "SELECT MaLop, AVG(DiemTin) FROM HOC_SINH WHERE AVG(DiemTin) >= 8.0 GROUP BY MaLop;" là câu lệnh SQL hợp lệ về mặt cú pháp.',
        isCorrect: false,
        explanation: 'Sai, hàm tổng hợp AVG() không được phép đặt trong mệnh đề WHERE. Cần phải sử dụng HAVING AVG(DiemTin) >= 8.0.'
      },
      {
        id: 'q27_c',
        label: 'c',
        statement: 'Để sắp xếp danh sách học sinh theo điểm Tin học giảm dần, nếu cùng điểm Tin thì sắp xếp họ tên theo thứ tự bảng chữ cái A-Z, ta dùng: "ORDER BY DiemTin DESC, HoTen ASC;".',
        isCorrect: true,
        explanation: 'Đúng, mệnh đề ORDER BY cho phép chỉ định nhiều tiêu chí sắp xếp theo thứ tự ưu tiên từ trái sang phải.'
      },
      {
        id: 'q27_d',
        label: 'd',
        statement: 'Câu lệnh "DELETE FROM HOC_SINH;" khi thực thi sẽ xóa toàn bộ cấu trúc bảng HOC_SINH khỏi cơ sở dữ liệu.',
        isCorrect: false,
        explanation: 'Sai, DELETE FROM HOC_SINH chỉ xóa dữ liệu bên trong bảng nhưng giữ lại cấu trúc bảng. Muốn xóa cấu trúc bảng phải dùng lệnh DROP TABLE HOC_SINH.'
      }
    ],
    explanation: 'Cần phân biệt kỹ mệnh đề WHERE và HAVING trong SQL, cũng như sự khác nhau giữa lệnh DELETE (xóa dữ liệu) và DROP TABLE (xóa cấu trúc).',
    cognitiveLevel: 'VDC',
    track: 'ICT',
    source: 'Đề khảo thí Sở GD&ĐT Hà Nội 2025'
  },

  // Câu 4 Phần II: Chủ đề F - Lập trình Python & Thuật toán
  {
    id: 'q28_tf4',
    topicId: 'topic_f',
    lessonId: 'lesson_f2',
    lessonTitle: 'Bài 2: Thuật toán Tìm kiếm và Sắp xếp',
    type: 'true_false',
    content: 'Cho đoạn mã chương trình Python thực hiện thuật toán Tìm kiếm nhị phân như sau:\n\ndef binary_search(arr, x):\n    left = 0\n    right = len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == x:\n            return mid\n        elif arr[mid] < x:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1',
    subQuestions: [
      {
        id: 'q28_a',
        label: 'a',
        statement: 'Nếu truyền vào mảng arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91] và x = 23, thuật toán sẽ tìm thấy x và trả về chỉ số 5.',
        isCorrect: true,
        explanation: 'Đúng, phần tử 23 nằm ở chỉ số 5 (bắt đầu từ chỉ số 0: arr[5] == 23).'
      },
      {
        id: 'q28_b',
        label: 'b',
        statement: 'Hàm trên vẫn đảm bảo hoạt động chính xác và tìm đúng vị trí nếu danh sách arr truyền vào là danh sách chưa được sắp xếp (ví dụ arr = [50, 10, 80, 20]).',
        isCorrect: false,
        explanation: 'Sai, tìm kiếm nhị phân dựa trên tính chất mảng đã sắp xếp. Nếu mảng chưa sắp xếp, hàm có thể loại bỏ nhầm nửa chứa phần tử cần tìm.'
      },
      {
        id: 'q28_c',
        label: 'c',
        statement: 'Biểu thức (left + right) // 2 thực hiện phép chia lấy phần nguyên trong Python.',
        isCorrect: true,
        explanation: 'Đúng, toán tử // trong Python là phép chia lấy phần nguyên (floor division).'
      },
      {
        id: 'q28_d',
        label: 'd',
        statement: 'Trong trường hợp mảng có n = 1.000.000 phần tử đã sắp xếp, số lần lặp tối đa của vòng lặp while trong thuật toán trên không vượt quá 20 lần.',
        isCorrect: true,
        explanation: 'Đúng, vì 2^20 = 1.048.576 > 1.000.000, số phép so sánh tối đa của Binary Search là log2(1.000.000) ≈ 20.'
      }
    ],
    explanation: 'Thuật toán Binary Search có hiệu năng vượt trội O(log n), chỉ mất tối đa khoảng 20 phép so sánh cho 1 triệu phần tử, nhưng đòi hỏi mảng đầu vào phải được sắp xếp.',
    cognitiveLevel: 'VDC',
    track: 'CS',
    source: 'Đề thi thử THPT Chuyên Quốc Gia 2025'
  }
];
