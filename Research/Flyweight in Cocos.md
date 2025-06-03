## Lý do Sử dụng Flyweight Pattern trong Lập trình Game Cocos

### Vấn đề: Quản lý Số lượng Lớn Đối tượng Giống Nhau

Trong game, thường có những lúc cần hiển thị hoặc quản lý một số lượng rất lớn các đối tượng mà chúng có nhiều đặc điểm giống hệt nhau.

**Ví dụ:**
*   **Rừng cây:** Hàng ngàn cây giống hệt nhau về hình dáng, màu sắc, loại lá.
*   **Đàn cá:** Hàng trăm con cá cùng một loài, có hình ảnh giống nhau.
*   **Viên đạn:** Rất nhiều viên đạn được bắn ra, tất cả đều có cùng hình ảnh, kích thước, tốc độ ban đầu.
*   **Gạch trong game xếp gạch:** Nhiều viên gạch có cùng màu sắc, hình dạng.
*   **Ký tự chữ trong một đoạn văn bản dài:** Nhiều chữ 'a', chữ 'b' giống hệt nhau.

Nếu mỗi cây, mỗi con cá, mỗi viên đạn đều là một đối tượng riêng biệt và lưu trữ tất cả thông tin của nó (hình ảnh, màu sắc, kích thước, loại...) thì sẽ xảy ra vấn đề:
*   **Tốn bộ nhớ:** Hàng ngàn đối tượng, mỗi đối tượng giữ một bản sao dữ liệu giống nhau sẽ ngốn rất nhiều RAM.
*   **Chậm hiệu suất:** Việc tạo ra, quản lý và xử lý hàng ngàn đối tượng riêng lẻ có thể làm game chạy chậm.

### Flyweight Pattern: "Chia sẻ" Phần Chung, "Tách riêng" Phần Riêng

**Flyweight Pattern (Mẫu Đối tượng Nhẹ) là một mẫu thiết kế nhằm giảm thiểu việc sử dụng bộ nhớ bằng cách chia sẻ càng nhiều dữ liệu càng tốt với các đối tượng tương tự khác.**

Nó hoạt động bằng cách tách dữ liệu của một đối tượng thành hai phần:
1.  **Intrinsic State (Trạng thái Nội tại/Chung):**
    *   Là những dữ liệu **không thay đổi** và **có thể chia sẻ** giữa nhiều đối tượng.
    *   Ví dụ: hình ảnh của cây, màu sắc của cây, loại lá. Đây là những thứ giống nhau cho tất cả các cây cùng loại.
    *   Dữ liệu này được lưu trữ trong một đối tượng "Flyweight" (Đối tượng nhẹ). Sẽ chỉ có một vài đối tượng Flyweight này thôi, mỗi loại đối tượng giống nhau sẽ có một Flyweight.

2.  **Extrinsic State (Trạng thái Ngoại tại/Riêng):**
    *   Là những dữ liệu **thay đổi** và **khác biệt** giữa các đối tượng, hoặc phụ thuộc vào ngữ cảnh.
    *   Ví dụ: vị trí (x, y) của mỗi cây, kích thước cụ thể của cây đó (nếu có thể hơi khác nhau một chút), trạng thái hiện tại của cây (ví dụ: đang bị cháy).
    *   Dữ liệu này **không** được lưu trữ trong đối tượng Flyweight. Thay vào đó, nó được truyền vào từ bên ngoài khi cần sử dụng đối tượng Flyweight.

### Nguyên lý Hoạt động của Flyweight Pattern

1.  **Flyweight Interface (Giao diện Đối tượng Nhẹ):**
    *   Định nghĩa một phương thức mà các Client (người sử dụng) sẽ gọi để thực hiện một hành động với Flyweight. Phương thức này thường nhận vào Extrinsic State làm tham số. Ví dụ: `draw(x, y, size)`.

2.  **Concrete Flyweight (Đối tượng Nhẹ Cụ thể):**
    *   Là các lớp triển khai Flyweight Interface.
    *   Mỗi Concrete Flyweight lưu trữ Intrinsic State. Ví dụ, `TreeFlyweight` sẽ lưu trữ hình ảnh của cây, màu sắc.
    *   Khi phương thức `draw(x, y, size)` được gọi, nó sẽ sử dụng Intrinsic State (hình ảnh, màu sắc) của chính nó kết hợp với Extrinsic State (vị trí x, y, kích thước) được truyền vào để vẽ cây lên màn hình.
    *   **Quan trọng:** Sẽ chỉ có một số ít đối tượng Concrete Flyweight được tạo ra (ví dụ: một `OakTreeFlyweight`, một `PineTreeFlyweight`).

3.  **Flyweight Factory (Nhà máy Đối tượng Nhẹ):**
    *   Đây là thành phần trung tâm quản lý việc tạo và chia sẻ các đối tượng Flyweight.
    *   Nó chứa một "pool" (bộ nhớ đệm) các đối tượng Flyweight đã được tạo.
    *   Khi Client yêu cầu một Flyweight (ví dụ: "cho tôi một cây sồi"), Factory sẽ:
        1.  Kiểm tra xem Flyweight cho "cây sồi" đã có trong pool chưa.
        2.  Nếu có, nó trả về tham chiếu đến đối tượng Flyweight đã tồn tại đó.
        3.  Nếu chưa, nó tạo một đối tượng `OakTreeFlyweight` mới, lưu vào pool, rồi trả về tham chiếu.
    *   Điều này đảm bảo rằng cho mỗi loại Intrinsic State (ví dụ: mỗi loại cây), chỉ có một đối tượng Flyweight duy nhất được tạo ra và tái sử dụng.

4.  **Client (Người sử dụng):**
    *   Client muốn hiển thị nhiều đối tượng (ví dụ: nhiều cây).
    *   Thay vì tạo một đối tượng `Tree` đầy đủ cho mỗi cây, Client sẽ:
        1.  Yêu cầu Flyweight Factory cung cấp một đối tượng Flyweight phù hợp (ví dụ: `OakTreeFlyweight`).
        2.  Tính toán hoặc lấy Extrinsic State cho từng cây (ví dụ: vị trí x, y của từng cây).
        3.  Gọi phương thức trên đối tượng Flyweight (ví dụ: `oakTreeFlyweight.draw(x1, y1, size1)` cho cây thứ nhất, `oakTreeFlyweight.draw(x2, y2, size2)` cho cây thứ hai, v.v.). Lưu ý rằng cùng một đối tượng `oakTreeFlyweight` được sử dụng nhiều lần.

**Luồng hoạt động cơ bản:**
Client muốn vẽ 1000 cây sồi.
1.  Lần 1: Client gọi `factory.getTree('oak')`. Factory tạo `OakTreeFlyweight` (lưu hình ảnh cây sồi), lưu vào pool, trả về.
2.  Lần 2 đến 1000: Client gọi `factory.getTree('oak')`. Factory thấy `OakTreeFlyweight` đã có trong pool, trả về ngay đối tượng đã có.
3.  Với mỗi cây, Client lấy vị trí (x, y) riêng của cây đó, rồi gọi `OakTreeFlyweight.draw(x, y)`. Cùng một đối tượng `OakTreeFlyweight` được dùng để vẽ tất cả 1000 cây, chỉ khác nhau ở vị trí (x,y) truyền vào.

### Tại sao nên dùng Flyweight Pattern trong Game Cocos?

*   **Tiết kiệm bộ nhớ đáng kể:**
    *   Đây là lợi ích lớn nhất. Thay vì hàng ngàn đối tượng mỗi cái giữ một bản sao dữ liệu chung (hình ảnh, màu sắc), chỉ có một vài đối tượng Flyweight giữ dữ liệu chung đó. Các đối tượng "ảo" khác chỉ cần lưu trữ hoặc tính toán dữ liệu riêng (vị trí, trạng thái).
*   **Tăng hiệu suất:**
    *   Giảm số lượng đối tượng cần tạo và quản lý giúp giảm gánh nặng cho bộ xử lý và bộ nhớ, có thể làm game chạy nhanh hơn.
    *   Việc chia sẻ đối tượng cũng có thể cải thiện hiệu suất cache.
*   **Quản lý đối tượng có trạng thái chung hiệu quả:**
    *   Khi cần thay đổi một đặc điểm chung (ví dụ: thay đổi hình ảnh của tất cả cây sồi), chỉ cần thay đổi nó trong một đối tượng `OakTreeFlyweight` duy nhất.

**Hình dung đơn giản:**
*   **Không dùng Flyweight:** Muốn vẽ 1000 người lính giống hệt nhau. Phải tạo 1000 bức tượng người lính bằng đất sét, mỗi bức tượng có đủ chi tiết từ đầu đến chân. Rất tốn đất sét (bộ nhớ).
*   **Dùng Flyweight:**
    *   Tạo MỘT cái khuôn đúc người lính (đây là `SoldierFlyweight`, chứa hình dáng chung).
    *   Để tạo 1000 người lính, chỉ cần dùng cái khuôn đó 1000 lần.
    *   Mỗi "người lính" thực sự chỉ là thông tin "vị trí đặt người lính này là ở đâu", "người lính này đang cầm cờ màu gì" (đây là Extrinsic State). Phần hình dáng chung được lấy từ cái khuôn duy nhất.
    *   Rất tiết kiệm "đất sét" vì chỉ cần một cái khuôn.

Flyweight Pattern đặc biệt hữu ích trong các tình huống game cần hiển thị số lượng lớn các thực thể đồ họa hoặc các đối tượng có nhiều đặc điểm chung, giúp tối ưu hóa việc sử dụng bộ nhớ và có thể cải thiện hiệu suất.