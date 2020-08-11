const SArray = function (keyname) {
  this._KeyName = keyname;
  this._Ary = new Array()

  // cur === -1 说明没有找到相同的
  this.AddValue = function (obj) {
    var _o = this.getKey(obj[0])
    if (_o.cur === -1) {
      this._Ary.splice(_o.index, 0, obj)
    }
    else {
      this._Ary[_o.cur] = obj
    }
  }

  this.ReMoveKey = function (val) {
    var _o = this.getKey(val)
    if (_o.cur !== -1) {
      this._Ary.splice(_o.cur, 1)
    }
  }

  // this.ReMove = function (obj) {
  //   var _o = this.getKey(obj[this._KeyName])
  //   if (_o.cur != -1) {
  //     this._Ary.splice(_o.cur, 1)
  //   }
  // }

  this.getKey = function (val) {
    if (this._Ary.length === 0) return { cur: -1, index: 0 }
    return this.getIndex(val, 0, this._Ary.length - 1)
  }

  // this._getKey = function (val, beIndex, endIndex) {
  //   if (beIndex >= endIndex) {
  //     var _o = this._Ary[beIndex];
  //     var _kv = _o[this._KeyName]
  //     if (_kv == val) {
  //       return { cur: beIndex, ne: beIndex }
  //     }
  //     if (_kv > val) {
  //       if (beIndex == 0) {
  //         return { cur: -1, ne: 0 }
  //       }
  //       return { cur: -1, ne: beIndex }
  //     }
  //     else {
  //       return { cur: -1, ne: beIndex + 1 }
  //     }

  //   }
  //   var _i = parseInt((beIndex + endIndex) / 2)
  //   var _o = this._Ary[_i];
  //   var _kv = _o[this._KeyName]
  //   if (_kv == val) {
  //     return { cur: _i, ne: _i }
  //   }
  //   if (_kv > val) {
  //     return this._getKey(val, beIndex, _i - 1)

  //   }
  //   return this._getKey(val, _i + 1, endIndex)
  // }

  this.getIndex = function (val, head, tail) {
    if (val < this._Ary[head][0]) {
      return { cur: -1, index: head }
    }

    if (val > this._Ary[tail][0]) {
      return { cur: -1, index: tail + 1 }
    }

    if (head >= tail) {
      if (val === this._Ary[tail][0]) {
        return { cur: tail, index: tail }
      } else if (val > this._Ary[tail][0]) {
        return { cur: -1, index: tail + 1 }
      } else return { cur: -1, index: tail }
    }

    let flag = parseInt((head + tail) / 2);
    if (val === this._Ary[flag][0]) {
      return { cur: flag, index: flag }
    }
    if (val > this._Ary[flag][0]) {
      flag++;
      return this.getIndex(val, flag, tail)
    } else {
      flag--;
      return this.getIndex(val, head, flag)
    }
  }
}

function orderl2({ state }, price) {
  if (!price) return;
  let v1 = [price.Prz, price.Sz]
  if (price.At === 0) {
    state.orderl2_obj[price.Sym] = { Sym: price.Sym, asks: new SArray(0), bids: new SArray(0), isreday: false }
  } else if (price.At === 1) {
    state.orderl2_obj[price.Sym].isreday = true
  }
  let orderl2 = state.orderl2_obj[price.Sym]
  if (!orderl2) return
  if (price.Dir === 1) {
    if (v1[1] > 0) {
      orderl2.bids.AddValue(v1)
    } else {
      orderl2.bids.ReMoveKey(v1[0])
    }
  } else if (price.Dir === -1) {
    if (v1[1] > 0) {
      orderl2.asks.AddValue(v1)
    } else {
      orderl2.asks.ReMoveKey(v1[0])
    }
  }
  if (state.orderl2_obj[price.Sym].isreday) {
    // broadcastIns.$emit('orderl2', orderl2)
    return orderl2;
  }
}




function changeOrder20Decimal(order20) {
  let num = Math.pow(10, Number(this.decimal))
  let PrzMinIncSize = Number(this.decimal);
  if (order20['Bids']) {
    let arr = order20['Bids']
    let newBids = [];
    arr.forEach(item => {
      item[0] = utils.totalNumSub(Math.floor(item[0] * num) / num, PrzMinIncSize);
      if (newBids.length == 0) {
        newBids.push(item);
      } else {
        let n = 0
        newBids.forEach(item1 => {
          if (item1[0] == item[0]) {
            item1[1] = utils.totalNumSub(Number(item[1]) + Number(item1[1]), this.instConfig.VolMinValSize)
            n++;
          }
        })
        if (n == 0) {
          newBids.push(item);
        }
      }
    })
    order20['Bids'] = newBids;
  }
  if (order20['Asks']) {
    let arr = order20['Asks']
    let newAsks = [];
    arr.forEach(item => {
      item[0] = utils.totalNumSub(Math.ceil(item[0] * num) / num, PrzMinIncSize);
      if (newAsks.length == 0) {
        newAsks.push(item);
      } else {
        let n = 0
        newAsks.forEach(item1 => {
          if (item1[0] == item[0]) {
            item1[1] = utils.totalNumSub(Number(item[1]) + Number(item1[1]), this.instConfig.VolMinValSize)
            n++;
          }
        })
        if (n == 0) {
          newAsks.push(item);
        }
      }
    })
    order20['Asks'] = newAsks;
  }
  return order20;
}

export {
  orderl2,
  changeOrder20Decimal,
}