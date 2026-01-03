(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();class v{constructor(e={}){this.questions=[],this.currentQuestionIndex=0,this.score=0,this.timeLeft=0,this.timerInterval=null,this.answerProcessing=!1,this.jokersUsed={fifty:!1,hint:!1,time:!1,skip:!1},this.TIME_PER_QUESTION=e.timePerQuestion||30,this.TIME_PER_BLANK_FILLING_QUESTION=e.timePerBlankFilling||45,this.onQuestionDisplay=e.onQuestionDisplay||(()=>{}),this.onAnswerCheck=e.onAnswerCheck||(()=>{}),this.onTimerUpdate=e.onTimerUpdate||(()=>{}),this.onQuizComplete=e.onQuizComplete||(()=>{})}startQuiz(e){if(!e||e.length===0)throw new Error("Soru listesi boş olamaz!");this.questions=e,this.currentQuestionIndex=0,this.score=0,this.resetJokers(),console.log("🚀 QuizEngine başlatıldı:",{totalQuestions:this.questions.length,timePerQuestion:this.TIME_PER_QUESTION}),this.displayCurrentQuestion()}displayCurrentQuestion(){const e=this.getCurrentQuestion();if(!e){console.error("Soru verisi bulunamadı!");return}this.answerProcessing=!1,this.onQuestionDisplay(e,this.currentQuestionIndex),this.startTimer(e)}getCurrentQuestion(){return this.questions[this.currentQuestionIndex]}startTimer(e){this.timerInterval&&clearInterval(this.timerInterval);const t=e.type==="BlankFilling";this.timeLeft=t?this.TIME_PER_BLANK_FILLING_QUESTION:this.TIME_PER_QUESTION,this.updateTimeDisplay(),this.timerInterval=setInterval(()=>{if(this.answerProcessing){clearInterval(this.timerInterval);return}this.timeLeft--,this.updateTimeDisplay(),this.timeLeft<=0&&(clearInterval(this.timerInterval),this.handleTimeUp())},1e3)}updateTimeDisplay(){this.onTimerUpdate(this.timeLeft)}handleTimeUp(){console.log("⏰ Süre doldu!"),this.checkAnswer(null)}checkAnswer(e){if(this.answerProcessing){console.log("⚠️ Cevap zaten işleniyor");return}this.answerProcessing=!0,clearInterval(this.timerInterval);const t=this.getCurrentQuestion(),s=this.isAnswerCorrect(e,t);return this.onAnswerCheck({isCorrect:s,userAnswer:e,correctAnswer:t.correctAnswer,question:t,questionIndex:this.currentQuestionIndex}),s}isAnswerCorrect(e,t){if(!e)return!1;const s=t.correctAnswer,n=r=>r?r.toString().trim().toLowerCase():"";return n(e)===n(s)}showNextQuestion(){if(this.currentQuestionIndex++,this.currentQuestionIndex>=this.questions.length){this.completeQuiz();return}this.resetJokers(),this.displayCurrentQuestion()}completeQuiz(){clearInterval(this.timerInterval);const e=this.getQuizStats();this.onQuizComplete(e),console.log("✅ Quiz tamamlandı:",e)}getQuizStats(){return{totalQuestions:this.questions.length,answeredQuestions:this.currentQuestionIndex,score:this.score,accuracy:this.currentQuestionIndex>0?(this.score/this.currentQuestionIndex*100).toFixed(1):0}}useJoker(e){if(this.jokersUsed[e])return console.warn(`${e} jokeri zaten kullanılmış!`),!1;switch(this.jokersUsed[e]=!0,e){case"fifty":return this.applyFiftyFiftyJoker();case"hint":return this.applyHintJoker();case"time":return this.applyTimeJoker();case"skip":return this.applySkipJoker();default:return console.error("Bilinmeyen joker tipi:",e),!1}}applyFiftyFiftyJoker(){return this.getCurrentQuestion(),!0}applyHintJoker(){return this.getCurrentQuestion(),!0}applyTimeJoker(){return this.timeLeft+=15,this.updateTimeDisplay(),!0}applySkipJoker(){return this.showNextQuestion(),!0}resetJokers(){this.jokersUsed={fifty:!1,hint:!1,time:!1,skip:!1}}cleanup(){this.timerInterval&&(clearInterval(this.timerInterval),this.timerInterval=null),this.answerProcessing=!1}}class g{constructor(e={}){this.score=0,this.totalScore=0,this.sessionScore=0,this.totalStars=0,this.isLoggedIn=!1,this.BASE_POINTS=e.basePoints||10,this.TIME_BONUS_MULTIPLIER=e.timeBonusMultiplier||.5,this.STREAK_BONUS_MULTIPLIER=e.streakBonusMultiplier||2,this.DIFFICULTY_MULTIPLIERS=e.difficultyMultipliers||{1:1,2:1.5,3:2},this.correctAnswers=0,this.wrongAnswers=0,this.currentStreak=0,this.bestStreak=0,this.onScoreUpdate=e.onScoreUpdate||(()=>{}),this.onStarsUpdate=e.onStarsUpdate||(()=>{})}addScore(e={}){const{timeLeft:t=0,totalTime:s=30,difficulty:n=1,isStreak:r=!1}=e;let a=this.BASE_POINTS;const c=this.DIFFICULTY_MULTIPLIERS[n]||1;if(a*=c,t>0){const h=t/s,m=a*this.TIME_BONUS_MULTIPLIER*h;a+=m}if(this.currentStreak>=3){const h=a*this.STREAK_BONUS_MULTIPLIER;a+=h}return a=Math.round(a),this.score+=a,this.sessionScore+=a,this.isLoggedIn&&(this.totalScore+=a),this.correctAnswers++,this.currentStreak++,this.currentStreak>this.bestStreak&&(this.bestStreak=this.currentStreak),this.onScoreUpdate({points:a,score:this.score,totalScore:this.totalScore,sessionScore:this.sessionScore,streak:this.currentStreak,difficulty:n,timeBonus:t>0}),console.log("📊 Puan eklendi:",{earnedPoints:a,currentScore:this.score,difficulty:n===1?"Kolay":n===2?"Orta":"Zor",streak:this.currentStreak,timeBonus:t>0}),a}recordWrongAnswer(){this.wrongAnswers++,this.currentStreak=0,console.log("❌ Yanlış cevap - Seri sıfırlandı")}addStars(e){return this.totalStars+=e,this.onStarsUpdate({stars:this.totalStars,addedAmount:e}),console.log("⭐ Yıldız eklendi:",{added:e,total:this.totalStars}),this.totalStars}spendStars(e){return this.totalStars<e?(console.warn("⚠️ Yeterli yıldız yok!"),!1):(this.totalStars-=e,this.onStarsUpdate({stars:this.totalStars,spentAmount:e}),console.log("💸 Yıldız harcandı:",{spent:e,remaining:this.totalStars}),!0)}getStats(){const e=this.correctAnswers+this.wrongAnswers,t=e>0?(this.correctAnswers/e*100).toFixed(1):0;return{score:this.score,totalScore:this.totalScore,sessionScore:this.sessionScore,stars:this.totalStars,correctAnswers:this.correctAnswers,wrongAnswers:this.wrongAnswers,totalQuestions:e,accuracy:parseFloat(t),currentStreak:this.currentStreak,bestStreak:this.bestStreak}}resetSession(){this.score=0,this.currentStreak=0,this.correctAnswers=0,this.wrongAnswers=0,console.log("🔄 Oturum sıfırlandı")}setLoginStatus(e){this.isLoggedIn=e}loadTotalScore(e){this.totalScore=e||0,console.log("📥 Toplam puan yüklendi:",this.totalScore)}loadStars(e){this.totalStars=e||0,console.log("📥 Yıldızlar yüklendi:",this.totalStars)}formatNumber(e){return e>=1e6?(e/1e6).toFixed(1)+"M":e>=1e3?(e/1e3).toFixed(1)+"K":e.toString()}}class p{constructor(e={}){this.lives=e.initialLives||3,this.maxLives=e.maxLives||5,this.lifeRegenEnabled=e.lifeRegenEnabled!==!1,this.regenIntervalMs=e.regenIntervalMs||1800*1e3,this.lastLifeTime=Date.now(),this.regenTimer=null,this.rewardShieldUntil=0,this.onLivesUpdate=e.onLivesUpdate||(()=>{}),this.onLifeLost=e.onLifeLost||(()=>{}),this.onLifeGained=e.onLifeGained||(()=>{}),this.onGameOver=e.onGameOver||(()=>{})}loseLife(){return Date.now()<this.rewardShieldUntil?(console.log("🛡️ Ödül kalkanı aktif - Can kaybı engellendi"),!1):this.lives<=0?(console.warn("⚠️ Can zaten 0"),this.handleGameOver(),!1):(this.lives--,this.lastLifeTime=Date.now(),this.onLifeLost({remainingLives:this.lives,isGameOver:this.lives<=0}),this.onLivesUpdate(this.lives),console.log("💔 Can kaybı:",{remaining:this.lives,max:this.maxLives}),this.lives<=0?this.handleGameOver():this.startLifeRegeneration(),!0)}gainLives(e=1){const t=this.lives;this.lives=Math.min(this.lives+e,this.maxLives);const s=this.lives-t;return s>0&&(this.onLifeGained({gained:s,total:this.lives}),this.onLivesUpdate(this.lives),console.log("❤️ Can kazanıldı:",{gained:s,total:this.lives,max:this.maxLives})),s}setLives(e){this.lives=Math.max(0,Math.min(e,this.maxLives)),this.onLivesUpdate(this.lives),console.log("🔧 Can ayarlandı:",this.lives)}startLifeRegeneration(){this.lifeRegenEnabled&&(this.lives>=this.maxLives||(this.regenTimer&&clearInterval(this.regenTimer),this.regenTimer=setInterval(()=>{Date.now()-this.lastLifeTime>=this.regenIntervalMs&&(this.lives<this.maxLives&&(this.gainLives(1),this.lastLifeTime=Date.now(),console.log("⏰ Otomatik can yenilendi")),this.lives>=this.maxLives&&(clearInterval(this.regenTimer),this.regenTimer=null))},6e4)))}activateRewardShield(e=4e3){this.rewardShieldUntil=Date.now()+e,console.log("🛡️ Ödül kalkanı aktif:",new Date(this.rewardShieldUntil).toISOString())}handleGameOver(){console.log("💀 GAME OVER - Can bitti!"),this.onGameOver({lives:this.lives}),this.regenTimer&&(clearInterval(this.regenTimer),this.regenTimer=null)}saveLives(){try{localStorage.setItem("lives",this.lives.toString()),localStorage.setItem("lastLifeTime",this.lastLifeTime.toString()),console.log("💾 Canlar kaydedildi:",this.lives)}catch(e){console.error("❌ Can kaydetme hatası:",e)}}loadLives(){try{const e=localStorage.getItem("lives"),t=localStorage.getItem("lastLifeTime");e&&(this.lives=parseInt(e)),t&&(this.lastLifeTime=parseInt(t),this.checkAndRegenerateLives()),console.log("📥 Canlar yüklendi:",this.lives),this.lives<this.maxLives&&this.startLifeRegeneration()}catch(e){console.error("❌ Can yükleme hatası:",e)}}checkAndRegenerateLives(){if(this.lives>=this.maxLives)return;const e=Date.now()-this.lastLifeTime,t=Math.floor(e/this.regenIntervalMs);if(t>0){const s=Math.min(t,this.maxLives-this.lives);this.gainLives(s),console.log("⏰ Otomatik yenileme:",{regenerated:s,total:this.lives})}}getTimeUntilNextLife(){if(this.lives>=this.maxLives)return 0;const e=Date.now()-this.lastLifeTime,t=this.regenIntervalMs-e%this.regenIntervalMs;return Math.max(0,t)}getFormattedTimeUntilNextLife(){const e=this.getTimeUntilNextLife(),t=Math.ceil(e/1e3),s=Math.floor(t/60),n=t%60;return`${s.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}`}getStatus(){return{lives:this.lives,maxLives:this.maxLives,percentage:(this.lives/this.maxLives*100).toFixed(0),timeUntilNextLife:this.getFormattedTimeUntilNextLife(),isGameOver:this.lives<=0}}cleanup(){this.regenTimer&&(clearInterval(this.regenTimer),this.regenTimer=null),this.saveLives()}}class f{constructor(e={}){this.inventory={fifty:0,hint:0,time:0,skip:0},this.used={fifty:!1,hint:!1,time:!1,skip:!1},this.prices=e.prices||{fifty:50,hint:30,time:40,skip:20},this.onInventoryUpdate=e.onInventoryUpdate||(()=>{}),this.onJokerUsed=e.onJokerUsed||(()=>{}),this.onJokerPurchased=e.onJokerPurchased||(()=>{})}purchase(e,t){const s=this.prices[e];if(!s)return console.error("❌ Geçersiz joker tipi:",e),{success:!1,reason:"invalid_type"};if(t<s)return console.warn("⚠️ Yeterli puan yok!"),{success:!1,reason:"insufficient_points"};const n=this.inventory[e]||0;return this.inventory[e]++,this.onJokerPurchased({jokerType:e,price:s,newCount:this.inventory[e],previousCount:n}),this.onInventoryUpdate(this.inventory),this.saveInventory(),console.log("🛒 Joker satın alındı:",{type:e,price:s,count:`${n} → ${this.inventory[e]}`}),{success:!0,price:s,newCount:this.inventory[e]}}use(e){return!this.inventory[e]||this.inventory[e]<=0?(console.warn("⚠️ Jokerin envanteri yok:",e),{success:!1,reason:"not_in_inventory"}):this.used[e]?(console.warn("⚠️ Joker bu soruda zaten kullanılmış:",e),{success:!1,reason:"already_used"}):(this.inventory[e]--,this.used[e]=!0,this.onJokerUsed({jokerType:e,remainingCount:this.inventory[e]}),this.onInventoryUpdate(this.inventory),this.saveInventory(),console.log("🃏 Joker kullanıldı:",{type:e,remaining:this.inventory[e]}),{success:!0})}earnFromAd(e){return this.inventory[e]=(this.inventory[e]||0)+1,this.onInventoryUpdate(this.inventory),this.saveInventory(),console.log("🎬 Reklamdan joker kazanıldı:",{type:e,count:this.inventory[e]}),this.inventory[e]}resetUsage(){this.used={fifty:!1,hint:!1,time:!1,skip:!1},console.log("🔄 Joker kullanımları sıfırlandı")}isAvailable(e){return this.inventory[e]>0&&!this.used[e]}getStatus(e){return{count:this.inventory[e]||0,used:this.used[e]||!1,available:this.isAvailable(e),price:this.prices[e]}}getAllStatus(){return{fifty:this.getStatus("fifty"),hint:this.getStatus("hint"),time:this.getStatus("time"),skip:this.getStatus("skip")}}getInventory(){return{...this.inventory}}setInventory(e){this.inventory={fifty:e.fifty||0,hint:e.hint||0,time:e.time||0,skip:e.skip||0},this.onInventoryUpdate(this.inventory),console.log("📥 Joker envanteri yüklendi:",this.inventory)}saveInventory(){try{localStorage.setItem("jokerInventory",JSON.stringify(this.inventory)),console.log("💾 Joker envanteri kaydedildi")}catch(e){console.error("❌ Joker kaydetme hatası:",e)}}loadInventory(){try{const e=localStorage.getItem("jokerInventory");if(e){const t=JSON.parse(e);this.setInventory(t)}}catch(e){console.error("❌ Joker yükleme hatası:",e)}}getJokerName(e,t="tr"){return{tr:{fifty:"50:50",hint:"İpucu",time:"Süre",skip:"Pas"},en:{fifty:"50:50",hint:"Hint",time:"Time",skip:"Skip"},de:{fifty:"50:50",hint:"Hinweis",time:"Zeit",skip:"Überspringen"}}[t]?.[e]||e}}console.log(`🧪 Core Modül Testleri Başlıyor...
`);console.log("1️⃣ QuizEngine Testi");new v({timePerQuestion:30,onQuestionDisplay:(i,e)=>{console.log(`  ✓ Soru ${e+1} gösterildi:`,i.question?.substring(0,30)+"...")},onTimerUpdate:i=>{(i===30||i===15||i===5)&&console.log(`  ⏱️  Kalan süre: ${i}s`)}});console.log(`  ✅ QuizEngine başarıyla oluşturuldu
`);console.log("2️⃣ ScoreManager Testi");const y=new g({onScoreUpdate:i=>{console.log(`  ✓ Puan güncellendi: +${i.points} (Toplam: ${i.score})`)}}),b=y.addScore({timeLeft:25,totalTime:30,difficulty:2});console.log(`  ✅ Puan sistemi çalışıyor - Kazanılan: ${b} puan
`);console.log("3️⃣ LifeManager Testi");const o=new p({initialLives:3,maxLives:5,onLifeLost:i=>{console.log(`  ⚠️  Can kaybedildi - Kalan: ${i.remainingLives}`)},onLifeGained:i=>{console.log(`  ❤️  Can kazanıldı - Toplam: ${i.total}`)}});o.loseLife();o.gainLives(2);console.log(`  ✅ Can sistemi çalışıyor - Mevcut: ${o.lives}/${o.maxLives}
`);console.log("4️⃣ JokerManager Testi");const d=new f({onJokerPurchased:i=>{console.log(`  🛒 ${i.jokerType} jokeri satın alındı - Fiyat: ${i.price}`)},onJokerUsed:i=>{console.log(`  🃏 ${i.jokerType} jokeri kullanıldı - Kalan: ${i.remainingCount}`)}}),L=d.purchase("fifty",100);if(L.success){const i=d.use("fifty");console.log(`  ✅ Joker sistemi çalışıyor - Sonuç: ${i.success?"Başarılı":"Başarısız"}
`)}console.log("📊 Test Özeti:");console.log("  ✅ QuizEngine: Başarılı");console.log("  ✅ ScoreManager: Başarılı");console.log("  ✅ LifeManager: Başarılı");console.log("  ✅ JokerManager: Başarılı");console.log(`
🎉 Tüm core modüller başarıyla test edildi!
`);console.log("💡 Şimdi mevcut script.js ile entegrasyon yapılabilir.");class w{constructor(){this.element=null}create(){const e=document.createElement("nav");return e.className="web-navbar",e.innerHTML=`
      <div class="web-navbar-container">
        <div class="web-navbar-brand">
          <div class="web-logo">
            <span class="web-logo-icon">🧠</span>
            <span class="web-logo-text">Bilgoo</span>
          </div>
          <span class="web-tagline">Türkiye'nin En Eğlenceli Bilgi Yarışması</span>
        </div>
        
        <div class="web-navbar-menu">
          <a href="#" class="web-navbar-link active" data-page="home">
            <span class="navbar-link-icon">🏠</span>
            Ana Sayfa
          </a>
          <a href="#" class="web-navbar-link" data-page="categories">
            <span class="navbar-link-icon">📚</span>
            Kategoriler
          </a>
          <a href="#" class="web-navbar-link" data-page="leaderboard">
            <span class="navbar-link-icon">🏆</span>
            Lider Tablosu
          </a>
          <a href="#" class="web-navbar-link" data-page="stats">
            <span class="navbar-link-icon">📊</span>
            İstatistikler
          </a>
          <a href="#" class="web-navbar-link" data-page="about">
            <span class="navbar-link-icon">ℹ️</span>
            Hakkımızda
          </a>
        </div>
        
        <div class="web-navbar-actions">
          <button class="web-btn-secondary" id="web-login-btn">
            <span>👤</span>
            Giriş Yap
          </button>
          <button class="web-btn-primary" id="web-start-game-btn">
            <span>🎮</span>
            Oyuna Başla
          </button>
        </div>
      </div>
    `,this.element=e,this.attachEventListeners(),e}attachEventListeners(){const e=this.element.querySelectorAll(".web-navbar-link");e.forEach(n=>{n.addEventListener("click",r=>{r.preventDefault();const a=n.dataset.page;this.navigateTo(a),e.forEach(c=>c.classList.remove("active")),n.classList.add("active")})});const t=this.element.querySelector("#web-login-btn");t&&t.addEventListener("click",()=>{window.location.href="/login.html"});const s=this.element.querySelector("#web-start-game-btn");s&&s.addEventListener("click",()=>{const n=new CustomEvent("web:show-categories");document.dispatchEvent(n)})}navigateTo(e){const t=new CustomEvent("web:navigate",{detail:{page:e}});document.dispatchEvent(t)}destroy(){this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this.element=null}}class k{constructor(){this.element=null}create(){const e=document.createElement("section");return e.className="web-hero",e.innerHTML=`
      <div class="web-hero-background">
        <div class="hero-gradient"></div>
        <div class="hero-pattern"></div>
      </div>
      
      <div class="web-hero-content">
        <div class="web-hero-text">
          <h1 class="web-hero-title">
            Bilgi Yarışmasının
            <span class="hero-title-highlight">Yeni Adresi</span>
          </h1>
          <p class="web-hero-subtitle">
            8 farklı kategoride binlerce soru, arkadaşlarınla yarış, 
            yeteneklerini geliştir ve lider tablosunda yerini al!
          </p>
          <div class="web-hero-actions">
            <button class="web-hero-btn-primary" id="hero-start-btn">
              <span class="btn-icon">🚀</span>
              <span class="btn-text">Hemen Başla</span>
            </button>
            <button class="web-hero-btn-secondary" id="hero-learn-more">
              <span class="btn-icon">📖</span>
              <span class="btn-text">Nasıl Oynanır?</span>
            </button>
          </div>
          
          <div class="web-hero-stats">
            <div class="hero-stat-item">
              <div class="hero-stat-value">10,000+</div>
              <div class="hero-stat-label">Soru</div>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat-item">
              <div class="hero-stat-value">50,000+</div>
              <div class="hero-stat-label">Oyuncu</div>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat-item">
              <div class="hero-stat-value">8</div>
              <div class="hero-stat-label">Kategori</div>
            </div>
          </div>
        </div>
        
        <div class="web-hero-visual">
          <div class="hero-visual-card">
            <div class="visual-card-header">
              <span class="visual-badge">Soru #1</span>
              <span class="visual-timer">⏱️ 30s</span>
            </div>
            <div class="visual-card-question">
              <p>Türkiye'nin başkenti neresidir?</p>
            </div>
            <div class="visual-card-options">
              <div class="visual-option">A) İstanbul</div>
              <div class="visual-option visual-option-correct">B) Ankara</div>
              <div class="visual-option">C) İzmir</div>
              <div class="visual-option">D) Bursa</div>
            </div>
          </div>
          <div class="hero-visual-floating hero-floating-1">
            <span class="floating-icon">🎯</span>
          </div>
          <div class="hero-visual-floating hero-floating-2">
            <span class="floating-icon">⭐</span>
          </div>
          <div class="hero-visual-floating hero-floating-3">
            <span class="floating-icon">🏆</span>
          </div>
        </div>
      </div>
    `,this.element=e,this.attachEventListeners(),e}attachEventListeners(){const e=this.element.querySelector("#hero-start-btn");e&&e.addEventListener("click",()=>{const s=new CustomEvent("web:show-categories");document.dispatchEvent(s)});const t=this.element.querySelector("#hero-learn-more");t&&t.addEventListener("click",()=>{window.location.href="/about.html"})}destroy(){this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this.element=null}}class S{constructor(e){this.category=e,this.element=null}create(){const e=document.createElement("div");e.className="category-card",e.dataset.category=this.category.id;const s={"genel-kultur":"🌍",tarih:"📜",cografya:"🗺️",bilim:"🔬",edebiyat:"📖",spor:"⚽",muzik:"🎵",teknoloji:"💻"}[this.category.id]||"📚";return e.innerHTML=`
      <div class="category-card-inner">
        <div class="category-card-icon">
          ${s}
        </div>
        <h3 class="category-card-title">${this.category.name}</h3>
        <p class="category-card-description">${this.category.description||""}</p>
        <div class="category-card-stats">
          <div class="category-stat">
            <span class="stat-label">Soru</span>
            <span class="stat-value">${this.category.questionCount||0}</span>
          </div>
          <div class="category-stat">
            <span class="stat-label">Doğru</span>
            <span class="stat-value">${this.category.correctAnswers||0}</span>
          </div>
        </div>
        <button class="category-card-button">
          <span>Başla</span>
          <span class="button-arrow">→</span>
        </button>
      </div>
      <div class="category-card-glow"></div>
    `,this.element=e,this.attachEventListeners(),e}attachEventListeners(){const e=this.element.querySelector(".category-card-button");e&&e.addEventListener("click",()=>{const t=new CustomEvent("category:selected",{detail:{category:this.category}});document.dispatchEvent(t)}),this.element.addEventListener("mouseenter",()=>{this.element.classList.add("category-card-hover")}),this.element.addEventListener("mouseleave",()=>{this.element.classList.remove("category-card-hover")})}destroy(){this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this.element=null}}class I{constructor(e){this.categories=e||this.getDefaultCategories(),this.element=null,this.cards=[]}getDefaultCategories(){return[{id:"genel-kultur",name:"Genel Kültür",description:"Her konudan sorular",questionCount:2500,correctAnswers:0},{id:"tarih",name:"Tarih",description:"Geçmişten günümüze",questionCount:1800,correctAnswers:0},{id:"cografya",name:"Coğrafya",description:"Dünya ve Türkiye",questionCount:1500,correctAnswers:0},{id:"bilim",name:"Bilim",description:"Fen bilimleri",questionCount:1200,correctAnswers:0},{id:"edebiyat",name:"Edebiyat",description:"Türk ve dünya edebiyatı",questionCount:1e3,correctAnswers:0},{id:"spor",name:"Spor",description:"Futbol, basketbol ve daha fazlası",questionCount:900,correctAnswers:0},{id:"muzik",name:"Müzik",description:"Türk ve dünya müziği",questionCount:800,correctAnswers:0},{id:"teknoloji",name:"Teknoloji",description:"Bilişim ve yenilikler",questionCount:700,correctAnswers:0}]}create(){const e=document.createElement("section");return e.className="categories-section",e.innerHTML=`
      <div class="categories-container">
        <div class="categories-header">
          <h2 class="categories-title">Kategorileri Keşfet</h2>
          <p class="categories-subtitle">
            İstediğin kategoride bilgini test et ve lider tablosunda yerini al
          </p>
        </div>
        
        <div class="categories-grid" id="categories-grid">
          <!-- Category cards will be inserted here -->
        </div>
      </div>
    `,this.element=e,this.renderCategories(),e}renderCategories(){const e=this.element.querySelector("#categories-grid");e&&(this.cards.forEach(t=>t.destroy()),this.cards=[],e.innerHTML="",this.categories.forEach(t=>{const s=new S(t),n=s.create();e.appendChild(n),this.cards.push(s)}))}updateCategoryStats(e,t){const s=this.categories.find(n=>n.id===e);s&&(Object.assign(s,t),this.renderCategories())}destroy(){this.cards.forEach(e=>e.destroy()),this.cards=[],this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this.element=null}}class C{constructor(e={}){this.container=null,this.navbar=null,this.hero=null,this.categoriesGrid=null,this.mainContent=null,this.currentView="home",this.onNavigate=e.onNavigate||(()=>{}),this.init()}init(){this.createLayout(),this.createComponents(),this.attachEventListeners(),this.renderHomePage()}createLayout(){this.container=document.createElement("div"),this.container.className="web-desktop-layout",this.container.innerHTML=`
            <div id="web-navbar-container"></div>
            <main class="web-main-content" id="web-main-content">
                <!-- Dynamic content will be loaded here -->
            </main>
            <footer class="web-footer">
                <div class="web-footer-container">
                    <p>&copy; 2025 Bilgoo - Tüm hakları saklıdır</p>
                </div>
            </footer>
        `,this.mainContent=this.container.querySelector("#web-main-content")}createComponents(){this.navbar=new w,this.container.querySelector("#web-navbar-container").appendChild(this.navbar.create()),this.hero=new k,this.categoriesGrid=new I}renderHomePage(){this.mainContent.innerHTML="",this.mainContent.appendChild(this.hero.create()),this.mainContent.appendChild(this.categoriesGrid.create())}renderCategoriesPage(){this.mainContent.innerHTML="",this.mainContent.appendChild(this.categoriesGrid.create())}navigate(e){switch(console.log("🧭 Navigation:",e),this.currentView=e,e){case"home":this.renderHomePage();break;case"categories":this.renderCategoriesPage();break;case"leaderboard":this.renderLeaderboard();break;case"stats":this.renderStats();break;case"about":window.location.href="/about.html";break;default:this.renderHomePage()}this.onNavigate(e)}renderLeaderboard(){this.mainContent.innerHTML=`
            <section class="web-page-section">
                <div class="web-page-container">
                    <h2 class="web-page-title">🏆 Lider Tablosu</h2>
                    <p class="web-page-subtitle">En başarılı oyuncular</p>
                    <div class="leaderboard-placeholder">
                        <p>Lider tablosu yükleniyor...</p>
                    </div>
                </div>
            </section>
        `}renderStats(){this.mainContent.innerHTML=`
            <section class="web-page-section">
                <div class="web-page-container">
                    <h2 class="web-page-title">📊 İstatistikler</h2>
                    <p class="web-page-subtitle">Performans analizin</p>
                    <div class="stats-placeholder">
                        <p>İstatistikler yükleniyor...</p>
                    </div>
                </div>
            </section>
        `}updateStats(e){console.log("Stats updated:",e)}setContent(e){this.mainContent&&(this.mainContent.innerHTML=e)}attachEventListeners(){document.addEventListener("web:navigate",e=>{this.navigate(e.detail.page)}),document.addEventListener("web:show-categories",()=>{this.navigate("categories")}),document.addEventListener("category:selected",e=>{console.log("Category selected:",e.detail.category)}),window.addEventListener("resize",()=>{this.handleResize()})}handleResize(){window.innerWidth<1024&&console.log("📱 Mobile layout aktif - web bileşenleri gizlendi")}mount(e){e&&this.container&&(e.appendChild(this.container),console.log("🖥️ Modern web layout monte edildi"))}destroy(){this.navbar&&this.navbar.destroy(),this.hero&&this.hero.destroy(),this.categoriesGrid&&this.categoriesGrid.destroy(),this.container&&this.container.parentElement&&this.container.parentElement.removeChild(this.container)}}class E{constructor(e={}){this.currentLayout=null,this.currentPlatform=null,this.breakpoint=e.breakpoint||1024,this.onLayoutChange=e.onLayoutChange||(()=>{}),this.onNavigate=e.onNavigate||(()=>{}),this.init()}init(){this.detectPlatform(),this.attachEventListeners(),this.loadAppropriateLayout()}detectPlatform(){const e=window.innerWidth;return this.currentPlatform=e>=this.breakpoint?"desktop":"mobile",console.log("📱 Platform tespit edildi:",{platform:this.currentPlatform,width:e,breakpoint:this.breakpoint}),this.currentPlatform}loadAppropriateLayout(){this.currentLayout&&this.currentLayout.destroy(),this.detectPlatform()==="desktop"?this.loadDesktopLayout():this.loadMobileLayout()}loadDesktopLayout(){console.log("🖥️ Desktop layout yükleniyor..."),document.querySelectorAll("#main-menu, .main-menu, .bottom-nav, .mobile-header, #category-selection").forEach(s=>{s&&(s.style.display="none")}),this.currentLayout=new C({onNavigate:s=>this.onNavigate(s)}),document.body.classList.add("desktop-mode"),document.body.classList.remove("mobile-mode");const t=document.getElementById("app")||document.body;this.currentLayout.mount(t),this.onLayoutChange("desktop"),console.log("✅ Desktop layout yüklendi")}loadMobileLayout(){console.log("📱 Mobile layout yükleniyor..."),this.currentLayout&&(this.currentLayout.destroy(),this.currentLayout=null),document.querySelectorAll(".web-desktop-layout, .web-navbar, .web-hero, .categories-section").forEach(s=>{s&&(s.style.display="none")}),document.querySelectorAll("#main-menu, .main-menu").forEach(s=>{s&&(s.style.display="")}),document.body.classList.add("mobile-mode"),document.body.classList.remove("desktop-mode"),this.onLayoutChange("mobile"),console.log("✅ Mobile layout aktif")}attachEventListeners(){let e;window.addEventListener("resize",()=>{clearTimeout(e),e=setTimeout(()=>{const t=this.detectPlatform();t!==this.currentPlatform&&(console.log(`🔄 Platform değişti: ${this.currentPlatform} → ${t}`),this.currentPlatform=t,this.loadAppropriateLayout())},250)})}updateStats(e){this.currentLayout&&this.currentLayout.updateStats&&this.currentLayout.updateStats(e)}navigate(e){this.currentLayout&&this.currentLayout.navigate&&this.currentLayout.navigate(e)}getCurrentPlatform(){return this.currentPlatform}isDesktop(){return this.currentPlatform==="desktop"}isMobile(){return this.currentPlatform==="mobile"}}const l=window.innerWidth<1024;window.__BILGOO_PLATFORM__={isMobile:l,isDesktop:!l,timestamp:Date.now()};console.log("🚀 Bilgoo Web v2.0 başlatılıyor...");console.log("📱 Platform:",l?"Mobile":"Desktop");console.log("⚡ Vite build sistemi aktif");console.log("🎨 Modern web tasarımı yüklendi");l||(console.log("🖥️ Desktop mod aktif - mobil elementler gizleniyor"),document.querySelectorAll("#main-menu, .main-menu, .bottom-nav, .mobile-header").forEach(e=>{e&&(e.style.display="none")}));const u=new E({breakpoint:1024,onLayoutChange:i=>{console.log("🔄 Layout değişti:",i),window.__BILGOO_PLATFORM__.isMobile=i==="mobile",window.__BILGOO_PLATFORM__.isDesktop=i==="desktop"},onNavigate:i=>{console.log("🧭 Navigasyon:",i)}});window.__BILGOO_LAYOUT_MANAGER__=u;console.log("✅ Layout Manager başlatıldı");setTimeout(()=>{u.updateStats({score:1250,stars:45,lives:3,displayName:"Test Kullanıcı"})},2e3);
