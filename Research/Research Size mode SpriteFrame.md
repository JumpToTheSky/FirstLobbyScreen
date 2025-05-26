# Research 27-5-2025: Tìm hiểu Size Mode (Custom, Trim, Raw) của SpriteFrame trong Cocos Creator 2.1.3

## 1. Bối cảnh

Thuộc tính `Size Mode` của một `cc.Sprite` component trong Cocos Creator xác định cách kích thước của Node chứa Sprite đó được tính toán và hiển thị, dựa trên thông tin từ `SpriteFrame` được gán. Nghiên cứu này làm rõ ba chế độ: `CUSTOM`, `TRIMMED`, và `RAW`. Lưu ý rằng `TRIMMED` và `RAW` ở đây liên quan đến cách `SpriteFrame` được xử lý khi import hoặc đóng gói, thông tin này sau đó được `cc.Sprite` sử dụng.

## 2. Nguyên lý hoạt động và Trường hợp sử dụng

### 2.1. Chế độ `TRIMMED` của `cc.Sprite` (Dựa trên SpriteFrame đã Trim)

*   **Nguyên lý hoạt động của SpriteFrame được Trim:**
    Khi một file ảnh được import và xử lý (ví dụ, qua Texture Packer tích hợp hoặc thiết lập import), nếu được cấu hình để "trim", các vùng pixel hoàn toàn trong suốt (alpha = 0) ở các cạnh của ảnh gốc sẽ bị loại bỏ. Một "bounding box" (khung chữ nhật bao quanh) nhỏ nhất chứa tất cả các pixel không trong suốt được xác định.
    Thông tin sau được lưu trữ cho SpriteFrame:
    *   `Rect`: Tọa độ và kích thước của vùng ảnh đã trim trên texture (atlas hoặc ảnh gốc).
    *   `Offset`: Độ lệch của tâm vùng ảnh đã trim so với tâm của ảnh gốc (trước khi trim).
    *   `Original Size`: Kích thước của ảnh gốc trước khi bị trim.
    *   `ContentSize` của SpriteFrame sẽ là kích thước của vùng đã trim.

*   **Hoạt động của `cc.Sprite` ở chế độ `TRIMMED`:**
    Khi `Size Mode` của `cc.Sprite` được đặt là `TRIMMED`, kích thước (width, height) của `cc.Node` chứa `cc.Sprite` sẽ tự động được đặt bằng `ContentSize` của `SpriteFrame` (tức là kích thước đã được trim).
    Phần hình ảnh được render là vùng đã trim. Thông tin `Offset` và `Original Size` được sử dụng để đảm bảo căn chỉnh chính xác, đặc biệt quan trọng cho sprite animations, nơi các frame có thể có kích thước trim khác nhau nhưng cần duy trì vị trí tương đối ổn định.

*   **Trường hợp sử dụng `TRIMMED`:**
    *   **Tối ưu hóa Texture Atlas:** Giảm không gian lãng phí, cho phép đóng gói nhiều sprite hơn vào một atlas, tiết kiệm bộ nhớ GPU.
    *   **Sprite Animations:** Phổ biến nhất. Đảm bảo các frame của animation được căn chỉnh đúng vị trí mặc dù kích thước thực tế của từng frame (sau khi trim) có thể khác nhau.
    *   **UI Elements với padding trong suốt:** Giúp các phần tử UI chỉ chiếm không gian trực quan cần thiết.

### 2.2. Chế độ `RAW` của `cc.Sprite` (Dựa trên SpriteFrame Nguyên bản)

*   **Nguyên lý hoạt động của SpriteFrame dạng Raw:**
    Nếu một SpriteFrame được xử lý ở chế độ "raw" (hoặc không được trim), toàn bộ kích thước của file ảnh gốc, bao gồm cả các vùng pixel trong suốt ở các cạnh, sẽ được giữ lại.
    *   `ContentSize` của SpriteFrame sẽ bằng kích thước đầy đủ của file ảnh gốc.
    *   `Offset` thường là (0,0).
    *   `Original Size` bằng `ContentSize`.

*   **Hoạt động của `cc.Sprite` ở chế độ `RAW`:**
    Khi `Size Mode` của `cc.Sprite` được đặt là `RAW`, kích thước (width, height) của `cc.Node` chứa `cc.Sprite` sẽ tự động được đặt bằng `ContentSize` của `SpriteFrame` (tức là kích thước đầy đủ của ảnh gốc).
    Toàn bộ hình ảnh gốc (bao gồm cả phần trong suốt ở biên) được render.

*   **Trường hợp sử dụng `RAW`:**
    *   **Ảnh nền (Backgrounds):** Khi cần ảnh chiếm một kích thước cố định, không bị cắt xén.
    *   **Tilemaps:** Các tile thường có kích thước cố định và cần giữ nguyên kích thước đó.
    *   **Sprite Sheet được tạo thủ công với kích thước cell cố định:** Khi việc trích xuất frame dựa trên kích thước đầy đủ của cell là mong muốn.
    *   **Ảnh không có vùng trong suốt ở biên:** Khi việc trim không mang lại lợi ích đáng kể.

### 2.3. Chế độ `CUSTOM` của `cc.Sprite`

*   **Nguyên lý hoạt động:**
    Khi `Size Mode` của `cc.Sprite` được đặt là `CUSTOM`, kích thước (width, height) của `cc.Node` chứa `cc.Sprite` sẽ **không** tự động được điều chỉnh dựa trên `SpriteFrame`. Thay vào đó, kích thước của Node sẽ được quyết định bởi các giá trị `width` và `height` được thiết lập thủ công cho Node đó trong Inspector hoặc qua code.
    SpriteFrame được gán sẽ được vẽ để lấp đầy (hoặc co giãn theo) kích thước tùy chỉnh này của Node. Cách SpriteFrame được co giãn hoặc lặp lại bên trong Node tùy chỉnh này còn phụ thuộc vào thuộc tính `Type` của `cc.Sprite` (`SIMPLE`, `SLICED`, `TILED`, `FILLED`).

*   **Hoạt động của `cc.Sprite` ở chế độ `CUSTOM`:**
    *   Với `Type = SIMPLE`: SpriteFrame sẽ được co giãn (stretch/scale) để vừa với kích thước `width` và `height` của Node.
    *   Với `Type = SLICED` (9-slicing): SpriteFrame sẽ được chia thành 9 vùng và co giãn một cách thông minh để duy trì tỷ lệ của các góc và biên, phù hợp cho việc tạo UI có thể thay đổi kích thước (ví dụ: nút bấm, panel).
    *   Với `Type = TILED`: SpriteFrame sẽ được lặp lại (tile) để lấp đầy kích thước của Node.
    *   Với `Type = FILLED`: Một phần của SpriteFrame sẽ được hiển thị dựa trên các thông số `Fill Type`, `Fill Center`, `Fill Start`, `Fill Range`, phù hợp cho việc tạo thanh tiến trình, hiệu ứng loading.

*   **Trường hợp sử dụng `CUSTOM`:**
    *   **Layout linh hoạt:** Khi cần `cc.Sprite` có kích thước cụ thể không phụ thuộc vào kích thước gốc của ảnh, ví dụ trong các hệ thống layout UI phức tạp.
    *   **Tạo các thành phần UI có thể thay đổi kích thước (Resizable UI):** Kết hợp với `Type = SLICED` là trường hợp phổ biến nhất.
    *   **Hiệu ứng đặc biệt:** Sử dụng `Type = TILED` để tạo hình nền lặp lại trong một khu vực nhất định, hoặc `Type = FILLED` cho các thanh trạng thái.
    *   Khi kích thước của Node được điều khiển bởi các yếu tố khác (ví dụ: widget, layout component).

## 3. So sánh sự khác biệt

*   **Nguồn gốc kích thước Node:**
    *   `TRIMMED`: Kích thước Node tự động bằng kích thước SpriteFrame đã được cắt bỏ phần trong suốt ở biên.
    *   `RAW`: Kích thước Node tự động bằng kích thước SpriteFrame nguyên bản (bao gồm cả phần trong suốt ở biên).
    *   `CUSTOM`: Kích thước Node được đặt thủ công bởi người dùng, độc lập với kích thước SpriteFrame.

*   **Ảnh hưởng của SpriteFrame:**
    *   `TRIMMED` và `RAW`: Kích thước SpriteFrame (đã trim hoặc nguyên bản) trực tiếp quyết định kích thước Node.
    *   `CUSTOM`: Kích thước SpriteFrame không quyết định kích thước Node; thay vào đó, SpriteFrame được điều chỉnh để phù hợp với kích thước Node đã đặt.

*   **Mục đích tối ưu hóa:**
    *   `TRIMMED` (liên quan đến cách SpriteFrame được xử lý): Chủ yếu để tối ưu hóa không gian Texture Atlas và bộ nhớ, đồng thời đảm bảo căn chỉnh đúng cho animation.
    *   `RAW` (liên quan đến cách SpriteFrame được xử lý): Dùng khi cần giữ nguyên vẹn kích thước gốc của ảnh.
    *   `CUSTOM`: Chủ yếu để kiểm soát layout và hành vi hiển thị linh hoạt của `cc.Sprite` component.

*   **Tính linh hoạt trong Layout:**
    *   `CUSTOM`: Cung cấp sự linh hoạt cao nhất trong việc xác định kích thước hiển thị của Sprite, không bị ràng buộc bởi kích thước ảnh gốc.
    *   `TRIMMED` và `RAW`: Kích thước Node bị ràng buộc bởi kích thước (đã xử lý) của SpriteFrame.

Việc lựa chọn `Size Mode` cho `cc.Sprite` phụ thuộc vào yêu cầu cụ thể về hiển thị và layout của từng đối tượng trong game. Chế độ `TRIMMED` (khi SpriteFrame được xử lý trim) thường là mặc định tốt cho tối ưu tài nguyên, trong khi `CUSTOM` cung cấp khả năng kiểm soát layout mạnh mẽ, đặc biệt với UI. `RAW` được dùng trong các trường hợp cần độ chính xác tuyệt đối của kích thước ảnh gốc.