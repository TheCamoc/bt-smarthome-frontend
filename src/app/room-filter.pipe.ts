import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roomFilter'
})
export class RoomFilterPipe implements PipeTransform {

  transform(devices: any[], room?: String): any[] {
    return devices.filter(device => device['room_name'] == room);
  }

}
