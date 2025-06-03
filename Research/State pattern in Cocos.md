## Lý do Sử dụng State Pattern trong Lập trình Game Cocos

### Vấn đề: Quản lý Đối tượng có Nhiều Trạng thái và Hành vi Phức tạp

Trong game, nhiều đối tượng có thể tồn tại ở các "trạng thái" khác nhau, và hành vi của chúng thay đổi đáng kể tùy thuộc vào trạng thái hiện tại.

**Ví dụ một nhân vật game:**
*   **Trạng thái Đứng yên (Idle):** Có thể nhìn xung quanh, chờ lệnh.
*   **Trạng thái Di chuyển (Running):** Phát animation chạy, thay đổi vị trí.
*   **Trạng thái Nhảy (Jumping):** Phát animation nhảy, có lực hấp dẫn tác động.
*   **Trạng thái Tấn công (Attacking):** Phát animation tấn công, gây sát thương.
*   **Trạng thái Bị thương (Hurt):** Phát animation bị thương, có thể tạm thời không di chuyển.
*   **Trạng thái Chết (Dead):** Nằm im, không thể làm gì.

Nếu quản lý tất cả các trạng thái và hành vi này bằng cách sử dụng nhiều câu lệnh `if-else` hoặc `switch-case` lồng nhau trong một lớp duy nhất của nhân vật, code sẽ nhanh chóng trở nên:
*   **Rất dài và phức tạp:** Khó đọc, khó hiểu, khó theo dõi luồng logic.
*   **Khó bảo trì:** Khi muốn sửa đổi hành vi của một trạng thái, hoặc thêm một trạng thái mới, phải dò tìm và sửa đổi trong một khối code lớn, dễ gây lỗi ở những chỗ khác.
*   **Vi phạm nguyên tắc Single Responsibility Principle và Open/Closed Principle:** Lớp nhân vật làm quá nhiều việc và phải sửa đổi thường xuyên khi có yêu cầu mới.

### State Pattern: "Đóng gói" Trạng thái và Hành vi thành Đối tượng Riêng

**State Pattern (Mẫu Trạng thái) là một mẫu thiết kế cho phép một đối tượng thay đổi hành vi của nó khi trạng thái nội tại của nó thay đổi. Đối tượng sẽ có vẻ như thay đổi lớp của nó.**

Nó hoạt động bằng cách "đóng gói" mỗi trạng thái và các hành vi liên quan đến trạng thái đó vào một đối tượng riêng biệt. Đối tượng chính (Context) sẽ giữ một tham chiếu đến đối tượng trạng thái hiện tại và ủy thác việc xử lý các yêu cầu cho đối tượng trạng thái đó.

### Nguyên lý Hoạt động của State Pattern

1.  **Context (Đối tượng Ngữ cảnh):**
    *   Là đối tượng có trạng thái thay đổi (ví dụ: `PlayerCharacter`).
    *   Duy trì một tham chiếu đến một thực thể của `ConcreteState` (đối tượng trạng thái cụ thể hiện tại).
    *   Cung cấp một giao diện (interface) để Client (người sử dụng) tương tác với nó (ví dụ: `player.jump()`, `player.attack()`).
    *   Khi một phương thức trên Context được gọi, nó sẽ **ủy thác** (delegate) việc thực thi cho đối tượng trạng thái hiện tại đang giữ. Ví dụ, khi `player.jump()` được gọi, nó sẽ gọi `currentState.handleJump()`.
    *   Context cũng cung cấp một phương thức để thay đổi trạng thái hiện tại của nó (ví dụ: `player.setState(newState)`). Việc chuyển trạng thái có thể do chính các đối tượng State quyết định.

2.  **State Interface (Giao diện Trạng thái):**
    *   Định nghĩa một giao diện chung cho tất cả các trạng thái cụ thể. Giao diện này thường bao gồm các phương thức tương ứng với các hành động mà Context có thể thực hiện (ví dụ: `handleInput()`, `update()`, `onEnterState()`, `onExitState()`).

3.  **Concrete State (Trạng thái Cụ thể):**
    *   Là các lớp triển khai State Interface. Mỗi lớp Concrete State đại diện cho một trạng thái cụ thể của Context (ví dụ: `IdleState`, `RunningState`, `JumpingState`).
    *   Mỗi Concrete State sẽ triển khai các phương thức trong State Interface để định nghĩa **hành vi cụ thể** của Context khi nó ở trạng thái đó. Ví dụ, `JumpingState.handleInput()` có thể không cho phép tấn công, trong khi `IdleState.handleInput()` thì có.
    *   **Quan trọng:** Một Concrete State có thể quyết định việc chuyển Context sang một trạng thái khác. Ví dụ, sau khi `JumpingState` hoàn thành việc nhảy, nó có thể gọi `context.setState(new IdleState())`.
    *   Các Concrete State thường giữ một tham chiếu ngược lại đến Context để có thể truy cập dữ liệu của Context hoặc gọi phương thức `setState()` của Context.

**Luồng hoạt động cơ bản:**
1.  `PlayerCharacter` (Context) khởi tạo với `IdleState` (Concrete State).
2.  Khi người chơi bấm nút "Nhảy" (gọi `player.jump()`):
    *   `PlayerCharacter` gọi `idleState.handleJump(this)`.
    *   `idleState.handleJump()` biết rằng khi đang đứng yên thì có thể nhảy. Nó sẽ:
        *   Thực hiện logic bắt đầu nhảy (ví dụ: đặt vận tốc y).
        *   Gọi `player.setState(new JumpingState())` để chuyển `PlayerCharacter` sang trạng thái `JumpingState`.
3.  Bây giờ, `PlayerCharacter` đang ở `JumpingState`. Nếu người chơi lại bấm nút "Nhảy" (gọi `player.jump()`):
    *   `PlayerCharacter` gọi `jumpingState.handleJump(this)`.
    *   `jumpingState.handleJump()` có thể được lập trình để không làm gì cả (vì nhân vật đang nhảy rồi).
4.  Khi nhân vật chạm đất (logic trong `jumpingState.update()`):
    *   `jumpingState.update()` sẽ gọi `player.setState(new IdleState())`.

### Tại sao nên dùng State Pattern trong Game Cocos?

*   **Loại bỏ các câu lệnh điều kiện phức tạp (if-else, switch-case):**
    *   Logic của mỗi trạng thái được đóng gói riêng trong lớp State tương ứng. Điều này làm cho code của Context (ví dụ: lớp PlayerCharacter) trở nên gọn gàng và dễ hiểu hơn rất nhiều.
*   **Dễ dàng thêm trạng thái mới:**
    *   Để thêm một trạng thái mới, chỉ cần tạo một lớp Concrete State mới triển khai State Interface. Ít ảnh hưởng đến các trạng thái hiện có hoặc Context. Điều này tuân theo Open/Closed Principle (mở rộng thì dễ, sửa đổi code cũ thì hạn chế).
*   **Hành vi của mỗi trạng thái được tập trung:**
    *   Tất cả logic liên quan đến một trạng thái cụ thể (ví dụ: cách di chuyển khi đang chạy, cách xử lý input khi đang nhảy) đều nằm trong lớp State của trạng thái đó. Dễ tìm kiếm, dễ sửa đổi.
*   **Làm cho việc chuyển đổi trạng thái rõ ràng hơn:**
    *   Việc chuyển đổi giữa các trạng thái được thực hiện một cách tường minh thông qua việc Context thay đổi đối tượng State mà nó đang giữ, hoặc các State tự quyết định khi nào cần chuyển.
*   **Mã nguồn có tổ chức và dễ bảo trì hơn:**
    *   Cấu trúc game trở nên rõ ràng hơn, mỗi trạng thái là một "viên gạch" riêng biệt.

**Hình dung đơn giản:**
*   **Không dùng State Pattern:** Một người có rất nhiều "vai diễn" (đứng, chạy, nhảy). Người đó phải tự nhớ kịch bản cho từng vai diễn và liên tục kiểm tra "bây giờ mình đang diễn vai gì?" để hành động cho đúng. Nếu thêm vai diễn mới, phải học thêm kịch bản và nhét vào bộ não vốn đã phức tạp.
*   **Dùng State Pattern:**
    *   Có một "sân khấu" (Context - là nhân vật).
    *   Mỗi "vai diễn" (đứng, chạy, nhảy) là một "diễn viên chuyên nghiệp" riêng (Concrete State). Mỗi diễn viên này chỉ biết kịch bản của vai mình.
    *   Tại một thời điểm, chỉ có MỘT diễn viên đứng trên sân khấu. Khi có yêu cầu (ví dụ: "hãy nhảy"), yêu cầu đó được đưa cho diễn viên đang trên sân khấu.
    *   Diễn viên đó sẽ thực hiện hành động theo kịch bản của mình.
    *   Diễn viên đó cũng có thể quyết định "vai của tôi hết rồi, mời diễn viên 'Nhảy' lên thay" (chuyển trạng thái).
    *   Lợi ích: Sân khấu (nhân vật) không cần biết chi tiết kịch bản của từng vai. Muốn thêm vai mới, chỉ cần thuê diễn viên mới. Mỗi diễn viên chỉ lo phần việc của mình.

State Pattern rất hữu ích khi một đối tượng có nhiều trạng thái và hành vi của nó thay đổi đáng kể giữa các trạng thái, giúp quản lý sự phức tạp này một cách có tổ chức và linh hoạt.