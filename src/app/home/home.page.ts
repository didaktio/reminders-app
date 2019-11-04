import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';

interface FormData {
  name: string;
  email: string;
  datetime: string;
  notes: string;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private afs: AngularFirestore,
    private toast: ToastController) { }

  async submitEvent(formData: FormData) {

    const toast = await this.toast.create({ message: 'Reminder set!', duration: 1000 * 60, showCloseButton: true });

    try {
      const d = new Date(formData.datetime);
      d.setMilliseconds(0);
      d.setSeconds(0);
  
      formData.datetime = d.toISOString();
  
      await this.afs.collection('reminders').add({
        ...formData,
        createdAt: new Date()
      });

      toast.present();

    } catch (error) {
      console.error(error);
      toast.message = 'An error has occurred. Ensure email and date fields are completed. If error persists, try refreshing the page.';
      toast.color = 'danger';
      toast.present();
    }


  }

}
