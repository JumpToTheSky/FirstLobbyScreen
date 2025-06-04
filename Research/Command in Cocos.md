## Lý do Sử dụng Command Pattern trong Lập trình Game Cocos

### Vấn đề: Quản lý và Thực thi Hành động một cách Linh hoạt

Trong game, có rất nhiều hành động mà người chơi hoặc hệ thống có thể thực hiện:
*   Nhân vật di chuyển, nhảy, tấn công.
*   Người chơi bấm nút trên UI để mở menu, lưu game.
*   AI điều khiển kẻ thù để ra lệnh cho chúng di chuyển, tấn công.

Cách xử lý trực tiếp là gọi thẳng hàm thực hiện hành động đó. Ví dụ, khi người chơi bấm nút "Nhảy", code sẽ gọi `nhanVat.nhay()`. Cách này đơn giản cho các trường hợp nhỏ, nhưng sẽ gặp vấn đề khi:
*   **Cần "Hoàn tác" (Undo) / "Làm lại" (Redo):** Làm sao để lưu lại hành động đã thực hiện và đảo ngược nó? Gọi thẳng hàm thì khó mà "gỡ" lại.
*   **Cần xếp hàng đợi hành động:** Ví dụ, trong game chiến thuật theo lượt, các lệnh cần được đưa vào hàng đợi và thực thi tuần tự.
*   **Cần lưu trữ hành động để dùng sau:** Ví dụ, ghi lại chuỗi hành động của người chơi để tạo replay, hoặc cho phép người chơi tùy chỉnh phím bấm (mapping key).
*   **Cần tách biệt người yêu cầu hành động và người thực hiện hành động:** Đối tượng bấm nút không nhất thiết phải biết chi tiết cách nhân vật nhảy như thế nào.

### Command Pattern: "Đóng gói" Hành động thành Đối tượng

**Command Pattern (Mẫu Lệnh) là một mẫu thiết kế biến một yêu cầu (một hành động) thành một đối tượng riêng biệt.** Đối tượng này chứa tất cả thông tin cần thiết để thực thi hành động đó.

Nó giống như việc thay vì trực tiếp ra lệnh miệng, người ta viết yêu cầu đó vào một "phiếu yêu cầu" (là đối tượng Command). "Phiếu yêu cầu" này sau đó có thể được đưa cho người khác xử lý, lưu trữ, hoặc xếp hàng.

### Nguyên lý Hoạt động của Command Pattern

1.  **Command Interface (Giao diện Lệnh):**
    *   Định nghĩa một phương thức chung cho tất cả các lệnh cụ thể, thường là `execute()`. Phương thức này sẽ là nơi hành động thực sự được kích hoạt.
    *   Có thể có thêm phương thức `undo()` nếu cần hỗ trợ hoàn tác.

2.  **Concrete Command (Lệnh Cụ thể):**
    *   Là các lớp triển khai Command Interface. Mỗi lớp Concrete Command đại diện cho một hành động cụ thể (ví dụ: `MoveCommand`, `JumpCommand`, `AttackCommand`).
    *   Khi một đối tượng Concrete Command được tạo, nó sẽ nhận và lưu trữ **Receiver (Người nhận lệnh)** - là đối tượng sẽ thực sự thực hiện hành động (ví dụ: đối tượng nhân vật).
    *   Nó cũng có thể lưu trữ các **tham số** cần thiết cho hành động (ví dụ: `MoveCommand` có thể lưu hướng di chuyển).
    *   Phương thức `execute()` của Concrete Command sẽ gọi phương thức tương ứng trên đối tượng Receiver. Ví dụ, `MoveCommand.execute()` sẽ gọi `character.move(direction)`.
    *   Nếu có `undo()`, nó sẽ thực hiện hành động ngược lại.

3.  **Receiver (Người nhận lệnh):**
    *   Là đối tượng biết cách thực hiện công việc thực tế. Ví dụ: đối tượng nhân vật có các phương thức `move()`, `jump()`, `attack()`.
    *   Receiver không biết gì về Command, nó chỉ thực hiện các hành động khi được yêu cầu.

4.  **Invoker (Người gọi lệnh):**
    *   Là đối tượng giữ một hoặc nhiều đối tượng Command.
    *   Invoker không biết chi tiết về lệnh cụ thể là gì, nó chỉ biết cách gọi `execute()` (và `undo()`) trên đối tượng Command mà nó đang giữ.
    *   Ví dụ về Invoker:
        *   Một nút bấm UI: Khi được nhấn, nó gọi `execute()` của Command được gán cho nó.
        *   Bộ quản lý input: Dựa trên phím người chơi bấm, nó tạo Command tương ứng và gọi `execute()`.
        *   Hàng đợi lệnh: Lưu trữ một danh sách các Command và thực thi chúng tuần tự.
        *   Bộ quản lý lịch sử (cho Undo/Redo): Lưu trữ các Command đã thực thi.

5.  **Client (Khách hàng):**
    *   Là phần code tạo ra các đối tượng Concrete Command.
    *   Client sẽ thiết lập Receiver cho Command (ví dụ, gán đối tượng nhân vật cho `MoveCommand`).
    *   Sau đó, Client sẽ đưa Command này cho Invoker.

**Luồng hoạt động cơ bản:**
Client tạo `MoveCommand(character, 'left')` -> Client đưa `MoveCommand` cho `InputHandler` (Invoker) -> Người chơi bấm phím trái -> `InputHandler` gọi `MoveCommand.execute()` -> `MoveCommand` gọi `character.move('left')`.

### Tại sao nên dùng Command Pattern trong Game Cocos?

*   **Hỗ trợ Undo/Redo một cách tự nhiên:**
    *   Mỗi hành động là một đối tượng Command. Để hoàn tác, chỉ cần gọi phương thức `undo()` của Command đó.
    *   Có thể duy trì một danh sách các Command đã thực thi để cho phép hoàn tác nhiều bước.
*   **Tạo hàng đợi lệnh và thực thi trì hoãn:**
    *   Các Command có thể được thêm vào một hàng đợi. Một bộ xử lý có thể lấy các Command từ hàng đợi và thực thi chúng tuần tự hoặc theo một lịch trình nào đó. Rất hữu ích cho game theo lượt hoặc khi cần xử lý nhiều yêu cầu một cách có trật tự.
*   **Lưu trữ và Tải lại Hành động:**
    *   Vì Command là đối tượng, chúng có thể được tuần tự hóa (serialize) và lưu vào file. Điều này hữu ích cho việc tạo hệ thống Replay (phát lại diễn biến game) hoặc lưu trạng thái của các hành động đang chờ.
*   **Tách biệt người yêu cầu và người thực hiện:**
    *   Invoker (ví dụ: nút bấm UI) không cần biết chi tiết cách một hành động được thực hiện. Nó chỉ cần biết có một Command và cách gọi `execute()`. Điều này làm tăng tính module hóa và giảm sự phụ thuộc.
    *   Dễ dàng thay đổi hành động của một Invoker bằng cách gán cho nó một Command khác mà không cần sửa code của Invoker.
*   **Hỗ trợ các macro command (lệnh phức hợp):**
    *   Một Command có thể chứa một danh sách các Command khác. Khi `execute()` của macro command được gọi, nó sẽ thực thi tuần tự các Command con.
*   **Cấu hình hành động linh hoạt (ví dụ: Key Mapping):**
    *   Có thể tạo một bản đồ (map) từ các phím bấm tới các đối tượng Command cụ thể. Khi người chơi bấm phím, hệ thống lấy Command tương ứng từ bản đồ và thực thi. Dễ dàng cho phép người chơi tùy chỉnh phím điều khiển.

**Hình dung đơn giản:**
*   **Không dùng Command Pattern:** Đầu bếp (Invoker) trực tiếp vào bếp (Receiver) và tự tay nấu món ăn (Action). Nếu muốn đổi món, đầu bếp phải học cách nấu món mới.
*   **Dùng Command Pattern:**
    *   Khách hàng (Client) viết yêu cầu "Nấu món Phở" vào một tờ giấy (Concrete Command: `PhoCommand`). Tờ giấy này có ghi sẵn là sẽ đưa cho "Bếp Trưởng Phở" (Receiver).
    *   Khách hàng đưa tờ giấy cho người phục vụ (Invoker).
    *   Người phục vụ chỉ cần đọc "Thực hiện yêu cầu trên giấy" (`execute()`) và đưa giấy cho Bếp Trưởng Phở.
    *   Bếp Trưởng Phở đọc giấy và nấu phở.
    *   Lợi ích: Người phục vụ không cần biết nấu phở. Tờ giấy có thể được lưu lại, hoặc xếp hàng chờ nếu bếp trưởng bận. Nếu khách muốn "Hủy món Phở" (`undo()`), có thể có thông tin trên giấy để làm điều đó.

Sử dụng Command Pattern giúp quản lý các hành động trong game một cách có cấu trúc, linh hoạt và dễ mở rộng hơn, đặc biệt khi cần các tính năng phức tạp như undo/redo, hàng đợi lệnh, hay replay.