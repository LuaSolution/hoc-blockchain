class Blockchain {
  constructor() {
    this.blockArr = [new Block("01/01/2018", "Genesis Block", "0")]
    this.level = 0
  }

  lastBlock = () => {
    return this.blockArr[this.blockArr.length - 1]
  }

  createBlock = (newBlock) => {
    newBlock.pHash = this.lastBlock().hash
    //newBlock.hash = newBlock.generateHash()
    newBlock.mining(this.level)
    this.blockArr.push(newBlock)
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
