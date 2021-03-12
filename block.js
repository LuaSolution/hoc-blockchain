class Block {
  constructor(pTime, data, pHash = "") {
    this.pTime = pTime
    this.data = data
    this.pHash = pHash
    this.hash = this.generateHash()
    this.nonce = 0
  }

  generateHash() {
    return CryptoJS.SHA256(
      this.pHash + this.pTime + JSON.stringify(this.data)
    ).toString()
  }

  mining= level => {
    while (this.hash.substring(0, level) !== Array(level + 1).join("0")) {
      //Kiểm tra xem giá trị Hash hiện tại đã đạt đủ số 0 ở đầu tiên như yêu vầu về độ khó đặt ra chưa. Lặp đi lặp lại hàm cho đến khi tìm được giá trị Hash đáp ứng yêu cầu.
      this.nonce++ //Tăng giá trị trong Block lên, để Hash mỗi lần sẽ nhận được một giá trị khác nhau. Nếu Hash không có 2 hoặc n số 0 ở đầu thì sẽ không đạt yêu cầu và phải tiếp tục Hash cái khác.
      this.hash = this.generateHash() //Tính toán lại Hash của toàn bộ Block ứng với lần tăng này.
    }
    console.log("Đã đào xong Block: " + this.hash)
  }
}
