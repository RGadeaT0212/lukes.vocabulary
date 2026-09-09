// ==========================================================================
// 🏆 MISSIONS ENGINE & LUKES GOLD CARD GENERATOR v1.0
// ==========================================================================

export const MissionsEngine = {
    // Algoritmo para generar el número de tarjeta único de 16 dígitos
    generateCardNumber(userId) {
        const seed = userId || 'LUKES-GUEST-999';
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const pad = (num, size) => ('00000000' + Math.abs(num)).slice(-size);
        const part1 = '4532'; // BIN simulado de Lukes Gold
        const part2 = pad(hash % 8999 + 1000, 4);
        const part3 = pad((hash * 3) % 8999 + 1000, 4);
        const part4 = pad((hash * 7) % 8999 + 1000, 4);

        return `${part1} ${part2} ${part3} ${part4}`;
    },

    // Generar expiración y CVV
    generateCardDetails(userId) {
        const now = new Date();
        const expMonth = String(now.getMonth() + 1).padStart(2, '0');
        const expYear = String(now.getFullYear() + 3).slice(-2);
        
        const cvv = Math.abs((userId ? userId.length * 137 : 888) % 900) + 100;

        return {
            expDate: `${expMonth}/${expYear}`,
            cvv: cvv
        };
    },

    // Modal de Lanzamiento de la Tarjeta Lukes Gold
    renderLukesGoldCardModal() {
        const user = window.AppState?.user || { name: 'Estudiante', id: 'GUEST123' };
        const cardNumber = this.generateCardNumber(user.id || user.email);
        const details = this.generateCardDetails(user.id || user.email);

        let modal = document.getElementById('lukes-gold-card-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'lukes-gold-card-modal';
            modal.className = "fixed inset-0 md:left-60 bg-[#1c2321]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans animate-fade-in select-none";
            document.body.appendChild(modal);
        } else {
            modal.classList.remove('hidden');
        }

        modal.innerHTML = `
            <div class="bg-white border border-[#e8e4d9] text-[#1c2321] w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-5 text-center relative">
                <button onclick="document.getElementById('lukes-gold-card-modal').classList.add('hidden')" 
                        class="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f7f5f0] hover:bg-[#e8e4d9] text-[#525b56] flex items-center justify-center text-xs cursor-pointer transition-all">✕</button>

                <div>
                    <span class="text-[9px] font-mono text-[#d97757] font-bold uppercase tracking-widest">// ¡RECOMPENSA EXCLUSIVA!</span>
                    <h2 class="title-brand font-black text-xl text-[#1c2321] uppercase tracking-tight mt-1">Lukes Gold Member</h2>
                </div>

                <!-- TARJETA VIRTUAL DORADA BANCARIA -->
                <div class="w-full h-52 rounded-2xl bg-gradient-to-tr from-[#b8860b] via-[#d4af37] to-[#ffd700] text-stone-900 p-5 shadow-xl flex flex-col justify-between relative overflow-hidden border border-[#ffe87c]/60">
                    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

                    <!-- Cabecera de la Tarjeta -->
                    <div class="flex justify-between items-start z-10">
                        <div class="text-left">
                            <span class="title-brand font-black text-base tracking-wider text-stone-900 block leading-none">lukes</span>
                            <span class="text-[7px] font-mono font-black text-stone-800 tracking-widest uppercase">GOLD DEBIT</span>
                        </div>
                        <i class="fa-solid fa-wifi text-stone-800 text-sm"></i>
                    </div>

                    <!-- Chip Simulado -->
                    <div class="w-10 h-8 rounded-md bg-gradient-to-r from-amber-200 to-amber-400 border border-amber-500/50 my-1 z-10 flex items-center justify-center">
                        <div class="w-full h-[1px] bg-amber-600/40"></div>
                    </div>

                    <!-- Número de Tarjeta y Datos -->
                    <div class="z-10 text-left">
                        <span class="font-mono text-sm sm:text-base font-black tracking-widest text-stone-950 block drop-shadow-xs">
                            ${cardNumber}
                        </span>
                        
                        <div class="flex justify-between items-end mt-2">
                            <div>
                                <span class="text-[7px] font-mono text-stone-800 uppercase block font-bold">TITULAR</span>
                                <span class="font-mono text-xs font-black uppercase text-stone-950 truncate max-w-[160px] block">
                                    ${user.name}
                                </span>
                            </div>
                            <div class="text-right">
                                <span class="text-[7px] font-mono text-stone-800 uppercase block font-bold">EXPIRES / CVV</span>
                                <span class="font-mono text-xs font-black text-stone-950 block">
                                    ${details.expDate} // ${details.cvv}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Explicación de uso -->
                <p class="text-xs text-[#525b56] leading-relaxed font-medium">
                    ¡Felicidades por aprender tus primeras 5 palabras! Has desbloqueado tu <strong>Tarjeta Virtual Lukes Gold</strong>. Podrás usarla en los próximos escenarios de simulación de compras, restaurantes e interacción en juegos dentro de la plataforma.
                </p>

                <button onclick="document.getElementById('lukes-gold-card-modal').classList.add('hidden')" 
                        class="w-full bg-[#2b3a35] hover:bg-[#1c2321] text-white font-mono text-xs font-black py-3.5 rounded-xl uppercase tracking-widest cursor-pointer transition-all shadow-md">
                    Guardar en mi Perfil ➔
                </button>
            </div>
        `;

        if (window.confetti) window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
};

window.MissionsEngine = MissionsEngine;