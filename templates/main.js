let ContribCards = Vue.component('contrib-card', {
    props:['contrib'],
    methods:{
        GitHubImg(img){
            return img?`https://github.com/${this.contrib.username}.png`:`https://github.com/${this.contrib.username}`
        }
    },
    template: `<div class="col-lg-4 order-lg-2">
                <div class="card" style="width: 15rem;">
                    <img class="card-img-top" :src=GitHubImg(true) alt="Card image cap">
                    <div class="card-body">
                    <h5 class="card-title">{{contrib.name}}</h5>
                    <p class="card-text">{{contrib.message}}</p>
                    <a :href=GitHubImg(false) class="btn btn-primary">Github account</a>
                    </div>
                </div>
                </div>`
        })

new Vue({
            el: '#app',
              data: {
                contribs:users},
              components:{ContribCards:ContribCards}
            })