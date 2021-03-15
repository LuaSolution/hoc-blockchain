class Blockchain {
  constructor() {
    this.blockArr = [new Block("01/01/2018", "Genesis Block", "0")]
    this.level = 0
    this.waiting = []
    this.bonus = 1
  }

  lastBlock = () => {
    return this.blockArr[this.blockArr.length - 1]
  }

  mineCoin = (wallet) => {
    if(this.waiting.length < 2) return
    //Hàm dùng để đào (thêm mới) một Block vào Blockchain.
    //Lúc này ta sẽ tạo mới một Block, trong Block này sẽ chứa toàn bộ các giao dịch đã bị tạm hoãn trước đó, do nó chưa được đào và chưa có Hash.
    const processing = this.waiting.splice(0, 2)
    const block = new Block(new Date(), processing, this.lastBlock().hash)

    block.mining(this.level) //Vẫn phải đào Hash bình thường cho lần này.
    this.blockArr.push(block) //Nối phần tử block vào làm phần tử cuối cùng của mảng Blockchain sau khi đã "đào" được.

    //Sau khi đã bỏ công ra đào 1 Hash cho giao dịch hiện tại, ta sẽ có quyền được thưởng một phần tiền thưởng cố định sẵn. GiaoDichTamHoan đã được xử lý xong nên có thể xóa nó đi, sau đó ta gán một GiaoDichTamHoan mới, trong đó chuyển lượng tiền ta nhận được vào ví của chính mình.
    this.waiting = [new Exchange(null, wallet, this.bonus)].concat([...this.waiting])
    //Chú ý là chỗ này ta không thể nhận được ngay lượng tiền này trong ví, vì giao dịch chưa được tạo và chưa có Hash. Nên trong Blockchain chưa có bản ghi mới ghi nhận số tiền đã chuyển vào ví nhận tiền thưởng.
    //Để nhận được khoản tiền thưởng cho lần đào này. Thì ta phải đợi đến lần đào kế tiếp, giao dịch tạm hoãn này sẽ được khớp lệnh và lúc đó tiền thưởng mới có trong ví.
  }

  createTransaction = (transaction) => {
    this.waiting.push(transaction)
  }

  //Chúng ta cũng cần một hàm để kiểm tra được lượng tiền đang có trong một địa chỉ ví nào đó.
  //Mỗi một ví tiền không hề có một con số tổng tiền được lưu trữ lại. Mà việc tính toán số tiền của một địa chỉ ví trong toàn bộ Blockchain ta phải lần tìm lần lượt toàn bộ các giao dịch bên trong Blockchain để kiểm đếm số tiền của một ví. Điều này sẽ rất an toàn và trung thực.
  //Một điều quan trọng là tính minh bạch ở đây vì bất kỳ ai khi có địa chỉ ví của bạn cũng sẽ nhìn thấy hết toàn bộ giao dịch bạn đã từng thực hiện trong hệ thống.
  checkBalance = (walletId) => {
    let balance = 0
    for (const block of this.blockArr) {
      //Đi duyệt qua toàn bộ các Block trong Blockchain
      for (const gd of block.data) {
        //Đi duyệt qua toàn bộ các giao dịch trong Block (Vì một Block là 1 mảng các giao dịch)
        if (gd.from === walletId) {
          //Nếu địa chỉ gửi là ví tiền này, thì tức là phải trừ ở Ví đi số tiền tương ứng trong giao dịch
          balance -= gd.value
        }

        if (gd.to === walletId) {
          //Nếu địa chỉ nhận là ví tiền này, thì tức là phải cộng vào Ví số tiền tương ứng trong giao dịch
          balance += gd.value
        }
      }
    }
    return balance //Kiểm đếm xong ta sẽ được con số tổng.
  }

  validating = () => {
    for (let i = 1; i < this.blockArr.length; i++) {
      const cBlock = this.blockArr[i] //Lấy ra phần tử ở vị trí hiện tại
      const pBlock = this.blockArr[i - 1] //Lấy ra phần tử ở ngay trước vị trí hiện tại
      if (
        cBlock.hash !== cBlock.generateHash() ||
        cBlock.pHash !== pBlock.hash
      ) {
        return false
      }
    }

    return true
  }
}
