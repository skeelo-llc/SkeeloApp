import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { SkeeloApiService } from 'src/app/services/skeeloApi/skeelo-api.service';
import * as CryptoJS from 'crypto-js';
import { AlertController } from '@ionic/angular';
let SignUpPage = class SignUpPage {
    constructor(storage, router, formBuilder, skeeloAPI, alertController) {
        this.storage = storage;
        this.router = router;
        this.formBuilder = formBuilder;
        this.skeeloAPI = skeeloAPI;
        this.alertController = alertController;
        this.signUpForm = formBuilder.group({
            name: ['', Validators.compose([
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern('[a-zA-Z ]*')
                ])],
            cpf: ['', Validators.compose([
                    Validators.pattern('([0-9]{3}).([0-9]{3}).([0-9]{3})-([0-9]{2})')
                ])],
            email: ['', Validators.compose([
                    Validators.required,
                    Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)@[a-z0-9-]+(\.[a-z0-9-]+).(\.[a-z]{2,15})$')
                ])],
            password: ['', Validators.compose([
                    Validators.required,
                    Validators.minLength(6)
                ])],
            phone: ['', Validators.compose([
                    Validators.required,
                    Validators.minLength(15)
                ])],
            birthdate: ['', Validators.compose([
                    Validators.required,
                    Validators.minLength(10)
                ])],
            zip: ['', Validators.compose([
                    Validators.required,
                    Validators.minLength(10)
                ])]
        });
    }
    ngOnInit() {
    }
    ngAfterViewInit() {
        this.slides.lockSwipes(true);
    }
    goToLogin() {
        this.slides.lockSwipes(false);
        this.slides.slideNext();
        this.slides.lockSwipes(true);
    }
    return() {
        this.slides.lockSwipes(false);
        this.slides.slidePrev();
        this.slides.lockSwipes(true);
        this.signUpForm.reset();
    }
    alertSuccess() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const alert = yield this.alertController.create({
                message: 'Usuário criado com sucesso!',
                buttons: [
                    {
                        text: 'OK',
                        handler: () => {
                            this.router.navigateByUrl('/tabs');
                            let userSettings = {
                                'showIntro': false,
                                'id': this.id,
                                'darkMode': false,
                                'notifications': {
                                    'push': true,
                                    'email': true,
                                    'whatsApp': true,
                                    'SMS': true
                                }
                            };
                            this.storage.set('userSettings', JSON.stringify(userSettings));
                        }
                    }
                ]
            });
            yield alert.present();
        });
    }
    alertError() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const alert = yield this.alertController.create({
                message: 'Não foi possível criar seu usuário! Confira seus dados e tente novamente',
                buttons: ['OK']
            });
            yield alert.present();
        });
    }
    emailUnique() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const alert = yield this.alertController.create({
                message: 'Esse e-mail já existe em nosso sistema. Deseja fazer login?',
                buttons: [
                    {
                        text: 'Tentar novamente'
                    },
                    {
                        text: 'Login',
                        handler: () => {
                            this.router.navigateByUrl('/login');
                        }
                    }
                ]
            });
            yield alert.present();
        });
    }
    cpfUnique() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const alert = yield this.alertController.create({
                message: 'Esse CPF já existe em nosso sistema. Deseja fazer login?',
                buttons: [
                    {
                        text: 'Tentar novamente'
                    },
                    {
                        text: 'Login',
                        handler: () => {
                            this.router.navigateByUrl('/login');
                        }
                    }
                ]
            });
            yield alert.present();
        });
    }
    phoneUnique() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const alert = yield this.alertController.create({
                message: 'Esse número de telefone já existe em nosso sistema. Deseja fazer login?',
                buttons: [
                    {
                        text: 'Tentar novamente'
                    },
                    {
                        text: 'Login',
                        handler: () => {
                            this.router.navigateByUrl('/login');
                        }
                    }
                ]
            });
            yield alert.present();
        });
    }
    check() {
        // FORMATAÇÃO DO CPF
        let cpf = this.signUpForm.value["cpf"].replace(/\./g, '');
        this.signUpForm.value["cpf"] = cpf.replace('-', '');
        // VERIFICAÇÃO DO CPF
        this.skeeloAPI.getUserByCpf(this.signUpForm.value['cpf'])
            .subscribe(([result]) => {
            if (result == undefined) {
                this.equalCpf = false;
            }
            else {
                this.cpfUnique();
            }
        });
        // FORMATAÇÃO DO TELEFONE
        let phone = this.signUpForm.value["phone"].replace('(', '').replace(')', '').replace('-', '');
        this.signUpForm.value["phone"] = phone.replace(/\s+/g, '');
        // VERIFICAÇÃO DO TELEFONE
        this.skeeloAPI.getUserByPhone(this.signUpForm.value['phone'])
            .subscribe(([result]) => {
            if (result == undefined) {
                this.equalPhone = false;
            }
            else {
                this.phoneUnique();
            }
        });
        // VERIFICAÇÃO DO EMAIL
        this.skeeloAPI.getUserByEmail(this.signUpForm.value['email'])
            .subscribe(([result]) => {
            if (result == undefined) {
                this.equalEmail = false;
            }
            else {
                this.emailUnique();
            }
        });
        if (this.equalCpf == false && this.equalPhone == false && this.equalEmail == false) {
            this.submit();
        }
    }
    submit() {
        let body;
        // FORMATAÇÃO DO TELEFONE
        let phone = this.signUpForm.value["phone"].replace('(', '').replace(')', '').replace('-', '');
        this.signUpForm.value["phone"] = phone.replace(/\s+/g, '');
        // FORMATAÇÃO DO ZIP
        let zip = this.signUpForm.value["zip"].replace(/\./g, '').replace('-', '');
        this.signUpForm.value["zip"] = zip;
        // CRIPTOGRAFIA DA SENHA
        let password = this.signUpForm.value["password"];
        let pepper = this.signUpForm.value["email"] + '28052018';
        let crypto = CryptoJS.AES.encrypt(password, pepper, {
            keySize: 128 / 8
        });
        this.signUpForm.value["password"] = crypto.toString();
        // VERIFICA SE EXISTE VALOR DE CPF E ADICIONA NO ARRAY
        if (this.signUpForm.value["cpf"] == '') {
            body = {
                'user_name': this.signUpForm.value["name"],
                'user_email': this.signUpForm.value["email"],
                'user_password': this.signUpForm.value["password"],
                'user_birthdate': this.signUpForm.value["birthdate"],
                'user_phone': this.signUpForm.value["phone"],
                'user_zip': this.signUpForm.value["zip"]
            };
        }
        else {
            let cpf = this.signUpForm.value["cpf"].replace(/\./g, '');
            this.signUpForm.value["cpf"] = cpf.replace('-', '');
            body = {
                'user_name': this.signUpForm.value["name"],
                'user_email': this.signUpForm.value["email"],
                'user_password': this.signUpForm.value["password"],
                'user_birthdate': this.signUpForm.value["birthdate"],
                'user_cpf': this.signUpForm.value["cpf"],
                'user_phone': this.signUpForm.value["phone"],
                'user_zip': this.signUpForm.value["zip"]
            };
        }
        ;
        // ENVIA OS DADOS PARA A API
        this.skeeloAPI.createUser(body)
            .subscribe(result => {
            if (result == 201) {
                this.skeeloAPI.getUserByEmail(this.signUpForm.value['email'])
                    .subscribe(([result]) => {
                    this.id = result.user_id;
                });
                this.alertSuccess();
            }
            else {
                this.alertError();
            }
        });
    }
    ;
};
tslib_1.__decorate([
    ViewChild(IonSlides, { static: false }),
    tslib_1.__metadata("design:type", IonSlides)
], SignUpPage.prototype, "slides", void 0);
SignUpPage = tslib_1.__decorate([
    Component({
        selector: 'app-sign-up',
        templateUrl: './sign-up.page.html',
        styleUrls: ['./sign-up.page.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [Storage,
        Router,
        FormBuilder,
        SkeeloApiService,
        AlertController])
], SignUpPage);
export { SignUpPage };
//# sourceMappingURL=sign-up.page.js.map