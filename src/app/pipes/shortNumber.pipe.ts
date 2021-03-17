import { Pipe, PipeTransform } from "@angular/core"

@Pipe({ name: 'shortNumber' })
export default class ShortNumberPipe implements PipeTransform {
  transform(number: number): string {
    return (() => {if (number > 1000000) {
      return Math.floor(number/1000/1000) + 'm'
    } else if (number > 1000) {
      return Math.floor(number/1000) + 'k'
    } else {
      return number+''
    }})()
  }
}
