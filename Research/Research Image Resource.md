## Nghiên cứu Nguyên lý Hoạt động của Các Thuộc tính Image Resource

### 1. Wrap Mode (Chế độ Lặp Lại Texture)

**1.1. Khái niệm Cơ bản:**
Wrap Mode là thuộc tính xác định hành vi của texture khi tọa độ UV (hệ tọa độ 2D ánh xạ texture lên bề mặt) nằm ngoài khoảng chuẩn `[0.0, 1.0]`. Khi một fragment shader yêu cầu một mẫu màu từ texture tại một tọa độ UV không nằm trong khoảng này, Wrap Mode sẽ quyết định giá trị màu nào được trả về.

**1.2. Các Chế độ Wrap Mode Phổ biến và Nguyên lý Hoạt động:**

*   **`Repeat` (Lặp Lại):**
    *   **Nguyên lý:** Khi tọa độ UV vượt ra ngoài khoảng `[0.0, 1.0]`, chỉ phần thập phân của tọa độ được sử dụng để lấy mẫu. Ví dụ, một tọa độ U là `2.75` sẽ được xử lý như `0.75`, tọa độ V là `-0.2` sẽ được xử lý như `0.8` (nếu phần cứng/API hỗ trợ lặp theo số âm, hoặc có thể là `0.8` sau khi cộng với 1 cho đến khi dương). Điều này tạo ra hiệu ứng lặp lại vô hạn của texture.
    *   **Ứng dụng:** Thường được sử dụng cho các bề mặt cần họa tiết lặp lại như sàn nhà, tường, địa hình, vải vóc.

*   **`ClampToEdge` (Kẹp Lại Theo Biên):**
    *   **Nguyên lý:** Tọa độ UV vượt ra ngoài khoảng `[0.0, 1.0]` sẽ bị "kẹp" (clamped) vào giá trị biên gần nhất. Ví dụ, một tọa độ U là `1.5` sẽ được coi là `1.0`, và tọa độ U là `-0.5` sẽ được coi là `0.0`. Điều này khiến cho các pixel ở biên của texture được kéo dài ra.
    *   **Ứng dụng:** Phù hợp cho các texture không nên lặp lại, như decals, skybox (tránh đường nối không mong muốn), hoặc các sprite đơn lẻ mà việc kéo dài biên là chấp nhận được.

*   **`MirroredRepeat` (Lặp Lại Đối Xứng):**
    *   **Nguyên lý:** Texture được lặp lại, nhưng mỗi lần lặp thứ hai sẽ bị lật ngược (phản chiếu qua gương). Ví dụ, khoảng UV `[0.0, 1.0]` hiển thị bình thường, `[1.0, 2.0]` sẽ là bản lật ngược của `[0.0, 1.0]`, `[2.0, 3.0]` lại bình thường, và cứ thế tiếp tục. Tương tự cho các giá trị âm.
    *   **Ứng dụng:** Hữu ích để tạo ra các họa tiết lặp lại có tính đối xứng, giúp giảm thiểu sự lặp lại quá rõ ràng hoặc các đường nối đột ngột có thể xảy ra với chế độ `Repeat` đơn thuần.

### 2. Filter Mode (Chế độ Lọc Texture)

**2.1. Khái niệm Cơ bản:**
Filter Mode xác định cách GPU lấy mẫu (sample) màu sắc từ các texel (pixel của texture) khi một pixel trên màn hình (fragment) không tương ứng chính xác 1:1 với một texel. Điều này thường xảy ra khi texture được phóng to (magnification) hoặc thu nhỏ (minification). Mục tiêu của filtering là cải thiện chất lượng hình ảnh, giảm thiểu răng cưa (aliasing) hoặc hiện tượng mờ (blurring).

**2.2. Các Chế độ Filter Mode Phổ biến và Nguyên lý Hoạt động:**

*   **`Nearest Neighbor` (Lân Cận Gần Nhất) / `Point Sampling`:**
    *   **Nguyên lý:** Chọn màu của texel có tọa độ gần nhất với tọa độ UV được yêu cầu. Đây là phương pháp lọc đơn giản và nhanh nhất.
    *   **Kết quả:** Tạo ra hình ảnh sắc nét, góc cạnh. Khi phóng to, hiện tượng "pixelated" (các khối vuông pixel rõ rệt) xảy ra. Khi thu nhỏ, có thể gây ra răng cưa hoặc nhấp nháy (moire patterns).
    *   **Hiệu suất:** Cao nhất do ít tính toán.
    *   **Ứng dụng:** Thường dùng cho pixel art, các ứng dụng yêu cầu độ sắc nét tuyệt đối và không muốn làm mờ, hoặc khi hiệu suất là ưu tiên hàng đầu.

*   **`Bilinear Filtering` (Lọc Song Tuyến Tính):**
    *   **Nguyên lý:** Lấy mẫu 4 texel gần nhất xung quanh tọa độ UV. Màu cuối cùng được tính bằng cách nội suy tuyến tính (weighted average) màu của 4 texel này, dựa trên khoảng cách từ tọa độ UV đến tâm của mỗi texel.
    *   **Kết quả:** Tạo ra hình ảnh mượt mà hơn so với `Nearest Neighbor`, giảm thiểu hiện tượng "pixelated" khi phóng to. Tuy nhiên, có thể làm hình ảnh hơi mờ và vẫn có thể gặp vấn牲 aliasing khi thu nhỏ nhiều.
    *   **Hiệu suất:** Chậm hơn `Nearest Neighbor` do yêu cầu nhiều phép đọc texel và tính toán nội suy.
    *   **Ứng dụng:** Lựa chọn phổ biến cho nhiều loại texture, cân bằng giữa chất lượng và hiệu suất.

*   **`Trilinear Filtering` (Lọc Tam Tuyến Tính):**
    *   **Nguyên lý:** Mở rộng từ `Bilinear Filtering` bằng cách sử dụng **Mipmaps**. Mipmaps là một chuỗi các phiên bản thu nhỏ, tiền xử lý của texture gốc (ví dụ: 512x512, 256x256, 128x128,...). `Trilinear Filtering` thực hiện `Bilinear Filtering` trên hai cấp độ Mipmap gần nhất với kích thước yêu cầu của texture tại fragment đó, sau đó nội suy tuyến tính giữa hai kết quả này.
    *   **Kết quả:** Cải thiện đáng kể chất lượng hình ảnh khi texture được thu nhỏ (nhìn từ xa hoặc ở góc nghiêng), giảm thiểu hiện tượng nhấp nháy và moire patterns. Hình ảnh có thể trông mờ hơn một chút so với `Bilinear` ở một số trường hợp nhất định nếu không có `Anisotropic Filtering`.
    *   **Hiệu suất:** Chậm hơn `Bilinear` do cần truy cập Mipmaps và thực hiện thêm một bước nội suy. Yêu cầu bộ nhớ texture tăng khoảng 33% để lưu trữ Mipmaps.
    *   **Ứng dụng:** Tiêu chuẩn cho hầu hết các texture trong môi trường 3D, đặc biệt khi đối tượng được nhìn ở nhiều khoảng cách. Cần phải tạo Mipmaps cho texture.

### 3. Premultiply Alpha (Alpha Nhân Trước)

**3.1. Khái niệm Cơ bản:**
Premultiply Alpha (PMA) là một phương pháp lưu trữ và xử lý thông tin màu sắc và độ trong suốt (alpha) của pixel.

*   **Non-Premultiplied Alpha (NPA) / Alpha Thông thường:** Giá trị màu (R, G, B) và giá trị Alpha (A) được lưu trữ độc lập. Pixel: `(R, G, B, A)`.
*   **Premultiplied Alpha (PMA):** Giá trị của các kênh màu (R, G, B) được nhân trước với giá trị Alpha. Pixel: `(R*A, G*A, B*A, A)`.

**3.2. Nguyên lý và Lợi ích của Premultiply Alpha:**

*   **Pha trộn (Blending) chính xác hơn, đặc biệt với Filtering:**
    *   **Vấn đề với NPA khi filtering:** Khi một texture có vùng chuyển tiếp từ mờ sang trong suốt được lọc (ví dụ `Bilinear`), các pixel màu ở rìa sẽ được nội suy với các pixel hoàn toàn trong suốt. Nếu các pixel hoàn toàn trong suốt này có màu RGB không phải là đen (ví dụ: màu rác từ quá trình tạo ảnh, hoặc màu trắng), việc nội suy có thể tạo ra các viền màu không mong muốn (viền tối nếu màu nền là đen, viền sáng nếu màu nền là trắng).
    *   **Giải pháp với PMA:** Trong PMA, một pixel hoàn toàn trong suốt (A=0) sẽ luôn có các kênh màu là `(R*0, G*0, B*0) = (0,0,0)`. Khi bộ lọc nội suy giữa một pixel màu `(R*A, G*A, B*A)` và một pixel trong suốt `(0,0,0)`, kết quả sẽ tự nhiên hơn, tránh được hiện tượng viền màu (color fringing).

*   **Tính toán Blending hiệu quả hơn:**
    Phép toán blending alpha tiêu chuẩn (Porter-Duff "source over" compositing) cho PMA đơn giản hơn so với NPA:
    *   PMA: `OutputColor = SourceColor_PMA + DestinationColor * (1 - SourceAlpha)`
    *   NPA: `OutputColor = (SourceColor_NPA * SourceAlpha) + (DestinationColor * (1 - SourceAlpha))`
    Công thức PMA loại bỏ một phép nhân cho mỗi thành phần màu trong mỗi thao tác blending, điều này có thể mang lại lợi ích về hiệu suất, đặc biệt trong các kịch bản có fill-rate cao hoặc nhiều lớp blending.

*   **Duy trì tính chất liên kết (Associativity) và giao hoán (Commutativity) trong một số phép toán:** PMA giúp việc áp dụng nhiều hiệu ứng (như blur kết hợp với thay đổi độ trong suốt) trở nên đúng đắn hơn về mặt toán học.

**3.3. Lưu ý khi sử dụng Premultiply Alpha:**

*   **Nguồn Texture:** Texture phải được tạo hoặc xuất ra ở định dạng PMA. Nếu một texture NPA được coi là PMA (hoặc ngược lại) bởi rendering pipeline, màu sắc sẽ bị sai lệch (thường là tối hơn nếu NPA được coi là PMA).
*   **Shader Pipeline:** Shader (vertex và fragment) phải được thiết kế để xử lý đúng đầu vào PMA.
*   **Màu sắc của vùng hoàn toàn trong suốt (A=0):** Với PMA, bất kỳ thông tin màu RGB nào ở vùng có A=0 đều trở thành `(0,0,0)`. Điều này là hành vi mong đợi và cần thiết để PMA hoạt động chính xác.

**3.4. Ứng dụng:**
PMA được khuyến nghị cho các texture có vùng chuyển tiếp alpha mềm mại như khói, lửa, hiệu ứng hạt, tóc, hoặc các sprite được anti-aliased. Nó giúp giải quyết các vấn đề về viền màu và đảm bảo quá trình blending và filtering diễn ra chính xác hơn.