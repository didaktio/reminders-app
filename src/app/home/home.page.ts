import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { mergeDateAndTime, toReadableDate } from '../@core/utils';
import { NgForm } from '@angular/forms';

interface FormData {
  name: string;
  email: string;
  datetime: {
    date: string;
    time: string;
  };
  notes: string;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private t: HTMLIonToastElement;

  constructor(
    private afs: AngularFirestore,
    private toast: ToastController) { }

  async submitEvent(form: NgForm) {

    const formData = form.value;

    try {

      const merged = mergeDateAndTime(formData.datetime.date, formData.datetime.time);

      await this.afs.collection('reminders').add({
        ...formData,
        datetime: merged.toISOString(),
        created: new Date().toISOString()
      });

      this.t = await this.toast.create({
        header: 'Reminder set!',
        message: `For: ${toReadableDate(merged, 'name-full', { includeTime: true })}`,
        duration: 2 * 60000,
        color: 'success'
      });

      await this.t.present();
      form.resetForm();

    } catch (error) {
      console.error(error);
      this.t = await this.toast.create({
        header: 'Ooops!',
        message: 'An error has occurred. Ensure email and date fields are completed. If error persists, try refreshing the page.',
        duration: 5 * 60000,
        color: 'danger'
      });

      this.t.present();
    }


  }

}
