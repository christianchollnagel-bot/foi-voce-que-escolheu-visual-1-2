/* Pictogramas originais para a interface. Objetos pertencem às cenas. */
window.Grafismos = (() => {
 const figures=[
 '<rect x="16" y="23" width="105" height="63" rx="3"/><path d="m17 25 51 36 52-36M17 85l38-35m66 35L83 49"/><circle cx="69" cy="60" r="10" fill="var(--vermelhao)"/>',
 '<path d="M41 12h46v37H41zM39 50h57v10H36zM42 60l-6 32m48-32 9 32"/><path d="M91 21h28v16H91z" fill="var(--menta)"/><path d="M98 28h11"/>',
 '<path d="M12 45q1-9 10-9h60q10 0 11 9l-4 28q-2 9-14 9H30q-10 0-13-9z"/><path d="M11 46q41-12 83 0M35 37q0-9 11-10h14q9 0 9 9"/><path d="M91 28q23-7 30 4l-2 22m-28 1 29-4"/>',
 '<path d="m18 30 71-15 11 51-71 15z" fill="var(--menta)"/><path d="M34 38h83v48H34z"/><path d="M45 52h55M45 61h40M45 70h27"/><path d="M103 38q7 10 14 8"/>',
 '<path d="M33 12h70v73H33zM36 85l-3 7m66-7 4 7M68 14v68M59 40v13m17-13v13"/><path d="m15 85 97-12" stroke="var(--vermelhao)"/>',
 '<rect x="20" y="42" width="75" height="36" rx="3"/><circle cx="41" cy="32" r="17"/><circle cx="77" cy="30" r="19"/><circle cx="41" cy="32" r="4"/><circle cx="77" cy="30" r="4"/><path d="m96 53 23-11v34l-23-10zM47 79l-9 13m34-13 11 13"/>',
 '<path d="M20 24h92v62H20zM22 42h87M36 14v18m18-18v18m27-18v18m18-18v18"/><path d="M42 54h28v19H42z" fill="var(--vermelhao)"/><path d="m79 62 6 6 12-15"/>',
 '<path d="m17 27 38-8 22 9 40-8-2 62-40 7-24-10-36 7z"/><path d="m54 20-3 58m27-49-3 59M24 41l22-5m-23 16 22-5m40-6 22-4m-23 16 22-5"/><path d="m43 59 21 5" stroke="var(--vermelhao)"/>',
 '<ellipse cx="67" cy="55" rx="50" ry="29"/><ellipse cx="67" cy="55" rx="40" ry="21"/><path d="m45 44 45 21M53 40l47 21" stroke="var(--menta)"/>',
 '<path d="m16 37 52-20 50 22-52 23zM16 38v34l50 22 52-23V39M66 61v31"/><path d="m41 27 50 23v18l-9 5V55L32 32" fill="var(--vermelhao)"/>',
 '<path d="M15 21h106v10H15zM24 32h88v44H24zM51 88l15-12 16 12"/><path d="M36 55q14-19 27-3l12-9 19 19H36z" fill="var(--menta)"/>',
 '<path d="m64 10 13 25 32 2-22 22 5 31-28-15-27 15 4-31-22-22 32-2z" fill="var(--menta)"/><path d="m63 25 2 37 23-19M65 62l-19 11"/>',
 '<rect x="33" y="11" width="68" height="78" rx="6"/><path d="M45 26h44m-44 7h44m-44 8h44"/><circle cx="67" cy="65" r="10" fill="var(--vermelhao)"/>'
 ];
 function icon(id){return '<svg class="object" viewBox="0 0 138 102" aria-hidden="true"><g fill="var(--papel)" stroke="var(--tinta)" stroke-width="3.3" stroke-linejoin="round" stroke-linecap="round">'+figures[id%figures.length]+'</g></svg>'}
 return {icon};
})();
