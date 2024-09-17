"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[9597],{9597:(P,r,l)=>{l.r(r),l.d(r,{BookingsPageModule:()=>b});var c=l(177),d=l(4341),k=l(5171),n=l(4742),o=l(3953),m=l(8244);function f(i,g){1&i&&(o.j41(0,"ion-col",4),o.nrm(1,"ion-spinner",5),o.k0s())}function u(i,g){1&i&&(o.j41(0,"ion-col",4)(1,"p"),o.EFF(2,"No bookings found!"),o.k0s()())}function B(i,g){if(1&i){const t=o.RV6();o.j41(0,"ion-item-sliding",null,0)(2,"ion-item")(3,"ion-avatar",1),o.nrm(4,"ion-img",8),o.k0s(),o.j41(5,"ion-label")(6,"h5"),o.EFF(7),o.k0s(),o.j41(8,"p"),o.EFF(9),o.k0s()()(),o.j41(10,"ion-item-options")(11,"ion-item-option",9),o.bIt("click",function(){const e=o.eBV(t).$implicit,a=o.sdS(1),v=o.XpG(2);return o.Njj(v.onCancelBooking(e.id,a))}),o.nrm(12,"ion-icon",10),o.k0s()()()}if(2&i){const t=g.$implicit;o.R7$(4),o.Y8G("src",t.placeImage),o.R7$(3),o.JRh(t.placeTitle),o.R7$(2),o.SpI("Guests: ",t.guestNumber,"")}}function p(i,g){if(1&i&&(o.j41(0,"ion-col",6)(1,"ion-list"),o.DNE(2,B,13,3,"ion-item-sliding",7),o.k0s()()),2&i){const t=o.XpG();o.R7$(2),o.Y8G("ngForOf",t.loadedBookings)}}const h=[{path:"",component:(()=>{var i;class g{constructor(s,e){this.bookingService=s,this.loadingCtrl=e,this.isLoading=!1}ngOnInit(){this.bookingSub=this.bookingService.bookings.subscribe(s=>{this.loadedBookings=s})}ionViewWillEnter(){this.isLoading=!0,this.bookingService.fetchBookings().subscribe(()=>{this.isLoading=!1})}onCancelBooking(s,e){e.close(),this.loadingCtrl.create({message:"Cancelling..."}).then(a=>{a.present(),this.bookingService.cancelBooking(s).subscribe(()=>{a.dismiss()})})}ngOnDestroy(){this.bookingSub&&this.bookingSub.unsubscribe()}}return(i=g).\u0275fac=function(s){return new(s||i)(o.rXU(m.L),o.rXU(n.Xi))},i.\u0275cmp=o.VBU({type:i,selectors:[["app-bookings"]],decls:12,vars:3,consts:[["slidingBooking",""],["slot","start"],["size-md","6","offset-md","3","class","ion-text-center",4,"ngIf"],["size-md","6","offset-md","3",4,"ngIf"],["size-md","6","offset-md","3",1,"ion-text-center"],["color","primary"],["size-md","6","offset-md","3"],[4,"ngFor","ngForOf"],[3,"src"],["color","danger",3,"click"],["name","trash","slot","icon-only"]],template:function(s,e){1&s&&(o.j41(0,"ion-header")(1,"ion-toolbar")(2,"ion-buttons",1),o.nrm(3,"ion-menu-button"),o.k0s(),o.j41(4,"ion-title"),o.EFF(5,"Your Bookings"),o.k0s()()(),o.j41(6,"ion-content")(7,"ion-grid")(8,"ion-row"),o.DNE(9,f,2,0,"ion-col",2)(10,u,3,0,"ion-col",2)(11,p,3,1,"ion-col",3),o.k0s()()()),2&s&&(o.R7$(9),o.Y8G("ngIf",e.isLoading),o.R7$(),o.Y8G("ngIf",!e.isLoading&&(!e.loadedBookings||e.loadedBookings.length<=0)),o.R7$(),o.Y8G("ngIf",!e.isLoading&&e.loadedBookings&&e.loadedBookings.length>0))},dependencies:[c.Sq,c.bT,n.mC,n.QW,n.hU,n.W9,n.lO,n.eU,n.iq,n.KW,n.uz,n.LU,n.CE,n.A7,n.he,n.nf,n.MC,n.ln,n.w2,n.BC,n.ai]}),g})()}];let b=(()=>{var i;class g{}return(i=g).\u0275fac=function(s){return new(s||i)},i.\u0275mod=o.$C({type:i}),i.\u0275inj=o.G2t({imports:[c.MD,d.YN,n.bv,k.iI.forChild(h)]}),g})()}}]);