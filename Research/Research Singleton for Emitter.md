## Lý do Sử dụng Singleton cho Bộ Phát Sự Kiện (Emitter Event) trong Cocos (JavaScript)

### Vấn đề Giao tiếp Giữa Các Thành phần Game

Trong quá trình phát triển game, các đối tượng và hệ thống khác nhau thường cần phải "trao đổi thông tin" hoặc "phản ứng" với hành động của nhau.

**Ví dụ:**
*   Khi người chơi điều khiển nhân vật nhặt một vật phẩm.
*   Giao diện người dùng (UI) cần được cập nhật để hiển thị số lượng vật phẩm mới.
*   Hệ thống âm thanh cần phát một hiệu ứng âm thanh tương ứng.

Nếu không có một cơ chế giao tiếp trung gian, nhân vật sẽ phải "biết" trực tiếp đến UI và hệ thống âm thanh để gọi các hàm cập nhật hoặc phát âm thanh. Cách tiếp cận này dẫn đến một số hạn chế:
*   **Phụ thuộc cao:** Các thành phần trở nên gắn kết chặt chẽ với nhau. Việc thay đổi một thành phần (ví dụ, thay đổi cách UI hiển thị) có thể yêu cầu sửa đổi ở nhiều nơi khác (ví dụ, trong code của nhân vật).
*   **Khó mở rộng:** Khi muốn thêm một thành phần mới cũng cần phản ứng với sự kiện (ví dụ, một hệ thống thành tựu), lại phải can thiệp vào code của đối tượng phát sinh sự kiện.
*   **Phức tạp hóa cấu trúc:** Mối quan hệ "biết tuốt" giữa các thành phần làm cho luồng dữ liệu và logic của game trở nên khó theo dõi và bảo trì.

### Cơ chế Emitter Event (Bộ Phát Sự Kiện)

Emitter Event là một mẫu thiết kế giúp giải quyết vấn đề giao tiếp trên bằng cách tạo ra một "trung tâm điều phối thông tin" ẩn danh.

1.  **Phát sự kiện (Emit):** Khi một sự kiện xảy ra (ví dụ, nhân vật nhặt vật phẩm), đối tượng gây ra sự kiện sẽ "thông báo" về sự kiện đó cho trung tâm điều phối, kèm theo các dữ liệu liên quan nếu có. Đối tượng này không cần biết ai sẽ quan tâm đến thông báo này.
2.  **Đăng ký lắng nghe (Listen/On):** Các thành phần khác muốn phản ứng với sự kiện đó (ví dụ, UI, hệ thống âm thanh) sẽ "đăng ký" với trung tâm điều phối rằng chúng quan tâm đến loại sự kiện cụ thể đó, thường là cung cấp một hàm callback sẽ được thực thi khi sự kiện xảy ra.
3.  **Truyền tải thông báo:** Khi trung tâm điều phối nhận được một thông báo sự kiện, nó sẽ duyệt qua danh sách các "người nghe" đã đăng ký cho loại sự kiện đó và thực thi các hàm callback tương ứng của họ, truyền vào dữ liệu của sự kiện nếu có.

Cách làm này giúp các thành phần trở nên "lỏng lẻo" hơn, chúng giao tiếp với nhau thông qua trung tâm điều phối mà không cần biết trực tiếp về sự tồn tại của nhau.

### Tầm quan trọng và Nguyên lý Hoạt động của Singleton khi Áp dụng cho Emitter Event

**Singleton là một mẫu thiết kế đảm bảo rằng một lớp chỉ có duy nhất một thực thể (instance) được tạo ra trong toàn bộ ứng dụng.**

Khi áp dụng Singleton cho Emitter Event, chúng ta đảm bảo rằng **chỉ có một "trung tâm điều phối thông tin" duy nhất cho toàn bộ game.**

**Nguyên lý hoạt động chi tiết của Singleton Emitter:**

1.  **Khởi tạo một lần duy nhất:**
    *   Lớp Emitter Singleton sẽ có một cơ chế kiểm soát việc tạo đối tượng. Thông thường, nó sẽ có một biến static (hoặc thuộc tính của module trong JavaScript) để lưu trữ thực thể duy nhất.
    *   Khi có yêu cầu truy cập vào Emitter lần đầu tiên (ví dụ, gọi một phương thức `getInstance()`), lớp sẽ kiểm tra xem thực thể đã được tạo chưa.
    *   Nếu chưa, nó sẽ tạo mới một thực thể của Emitter và lưu trữ vào biến static đó.
    *   Nếu đã có, nó sẽ trả về tham chiếu đến thực thể đã tồn tại.
    *   Mọi yêu cầu truy cập tiếp theo sẽ luôn trả về cùng một thực thể này.

2.  **Cung cấp điểm truy cập toàn cục:**
    *   Lớp Emitter Singleton cung cấp một cách thức (thường là một phương thức static như `getInstance()` hoặc export trực tiếp module trong JavaScript) để các phần khác của game có thể lấy được tham chiếu đến thực thể duy nhất này.

3.  **Hoạt động của Emitter trên thực thể duy nhất:**
    *   **Đăng ký lắng nghe (On/Listen):** Khi một thành phần (ví dụ: UI) muốn lắng nghe sự kiện 'PLAYER_SCORED', nó sẽ gọi phương thức `on('PLAYER_SCORED', callbackFunction)` trên thực thể Emitter duy nhất này. Emitter sẽ lưu trữ thông tin về sự kiện 'PLAYER_SCORED' và `callbackFunction` của UI vào một cấu trúc dữ liệu nội bộ (ví dụ: một đối tượng map tên sự kiện với một mảng các hàm callback).
    *   **Phát sự kiện (Emit):** Khi một thành phần khác (ví dụ: Player) thực hiện hành động ghi điểm, nó sẽ gọi phương thức `emit('PLAYER_SCORED', scoreData)` trên cùng thực thể Emitter duy nhất đó.
    *   **Thông báo đến người nghe:** Emitter, khi nhận được lệnh `emit`, sẽ tìm trong cấu trúc dữ liệu nội bộ của nó tất cả các hàm callback đã đăng ký cho sự kiện 'PLAYER_SCORED'. Sau đó, nó sẽ lần lượt gọi từng hàm callback này, truyền `scoreData` làm tham số. Vì UI đã đăng ký trước đó, hàm callback của UI sẽ được gọi, và UI có thể cập nhật hiển thị điểm số.

**Lý do chính cho việc này là:**

*   **Đảm bảo tính nhất quán của kênh giao tiếp:** Nếu có nhiều thực thể Emitter Event khác nhau, một thành phần có thể phát sự kiện qua một Emitter A, trong khi một thành phần khác lại đăng ký lắng nghe trên Emitter B. Điều này dẫn đến việc thông tin không được truyền tải đúng cách. Với một Singleton Emitter duy nhất, tất cả các hoạt động phát và lắng nghe đều diễn ra trên cùng một kênh, sử dụng cùng một cấu trúc dữ liệu lưu trữ các listener.
*   **Truy cập toàn cục và dễ dàng:** Vì chỉ có một thực thể duy nhất, bất kỳ thành phần nào trong game cũng có thể dễ dàng truy cập và sử dụng Emitter này để phát hoặc lắng nghe sự kiện mà không cần phải truyền tham chiếu của Emitter qua nhiều lớp hay đối tượng.
*   **Quản lý tập trung:** Tất cả các đăng ký lắng nghe sự kiện và các sự kiện đang chờ xử lý (nếu có cơ chế hàng đợi) đều được quản lý tại một điểm duy nhất, trong trạng thái nội bộ của thực thể Singleton đó. Điều này giúp đơn giản hóa việc theo dõi và gỡ lỗi các luồng sự kiện trong game.

**Hình dung đơn giản:**
Xem Emitter Event như một "bảng tin trung tâm" của dự án game.
*   Nếu Emitter là Singleton: Chỉ có MỘT bảng tin. Mọi người muốn thông báo điều gì đó sẽ đăng lên bảng tin này. Ai muốn biết thông tin gì sẽ đến xem bảng tin này. Tất cả đều tương tác với cùng một nơi, cùng một danh sách người đăng ký nhận tin.
*   Nếu Emitter không phải Singleton: Có thể có nhiều bảng tin khác nhau. Người A đăng thông báo lên bảng tin 1, nhưng người B lại chỉ xem bảng tin 2 (và đăng ký nhận tin ở bảng 2), dẫn đến việc bỏ lỡ thông tin.