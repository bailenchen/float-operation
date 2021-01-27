/*
 *  float-operation v0.0.2
 *  A library of JavaScript tools for floating-point calculation.
 *  https://github.com/bailenchen/float-operation
 *  Copyright (c) 2021 BaiLen Chen <bailenchen@126.com>
 *  MIT Licence
 */

const _add = Symbol('_add')
const _mul = Symbol('_mul')
const _division = Symbol('_division')
const _verify = Symbol('_verify')
const _check = Symbol('_check')


class Operation {
  [_verify](isdivision, val) {
    val.forEach(element => {
      const _element = Number(element)
      if (Number.isNaN(_element)) {
        throw Error(`${element} is an invaild number`) 
      }
    })

    if (isdivision && val[1] == 0) {
      throw Error(`0 cannot be the divisor`) 
    }
  }
  [_check](options) {
    const isdivision = !!options.isdivision
    try {
      this[_verify](isdivision, options.value)
    } catch (e) {
      console.error(e.message)
      return false
    }
    return true
  }

  add(num1, num2) {
    if (!this[_check]({ value: [num1, num2] })) return
    return this[_add](num1, num2)
  }
  [_add](v1, v2) {
    let r1, r2
    try {
      r1 = v1.toString().split('.')[1].length // decimal places of the 1st addend
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = v2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    const m = Math.pow(10, Math.max(r1, r2)) // has most number of decimal digits
    return (v1 * m + v2 * m) / m
  }

  sub(num1, num2) {
    if (!this[_check]({ value: [num1, num2] })) return
    return this[_add](num1, -num2)
  }

  mul(num1, num2) {
    if (!this[_check]({ value: [num1, num2] })) return
    return this[_mul](num1, num2)
  }
  [_mul](v1, v2) {
    let m = 0
    const s1 = v1.toString()
    const s2 = v2.toString()
    try {
      m += s1.split('.')[1].length
    } catch (e) {}
    try {
      m += s2.split('.')[1].length
    } catch (e) {}

    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
  }

  division(num1, num2) {
    if (!this[_check]({ isdivision: true, value: [num1, num2] })) return
    return this[_division](num1, num2)
  }
  [_division](v1, v2) {
    let t1 = 0
    let t2 = 0
    try {
      t1 = v1.toString().split('.')[1].length
    } catch (e) {}
    try {
      t2 = v2.toString().split('.')[1].length
    } catch (e) {}

    const r1 = Number(v1.toString().replace('.', ''))
    const r2 = Number(v2.toString().replace('.', ''))
    return (r1 / r2) * Math.pow(10, t2 - t1)
  }
}
export default new Operation()
