"use client";

import { useRef, useState } from "react";
import { formatCLP } from "@/lib/utils";
import { createTransbankDonationAction } from "@/lib/actions/donation-actions";

type Method = "transferencia" | "webpay" | "mercadopago";

const METHODS: { id: Method; label: string; hint: string; icon: string; active: boolean }[] = [
  { id: "transferencia", label: "Transferencia bancaria / WhatsApp", hint: "", icon: "💬", active: true },
  { id: "webpay", label: "Tarjeta de crédito o débito (Webpay)", hint: "", icon: "💳", active: true },
  { id: "mercadopago", label: "Mercado Pago", hint: "Próximamente", icon: "🛒", active: false },
];

const ANONYMOUS_EMAIL = "fundacionhoces@gmail.com";

const BANK_DETAILS = [
  { label: "Nombre", value: "Fundación HOCES" },
  { label: "Entidad financiera", value: "Banco Estado" },
  { label: "Tipo de cuenta", value: "Cuenta Vista" },
  { label: "Número de cuenta", value: "36870052655" },
  { label: "RUT", value: "65.255.726-6" },
  { label: "Correo", value: "fundacionhoces@gmail.com" },
];

export function DonationWidget({
  amounts,
  whatsapp,
  title = "Colabora hoy",
}: {
  amounts: number[];
  whatsapp: string;
  title?: string;
}) {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [mensual, setMensual] = useState(false);
  const [anonimo, setAnonimo] = useState(false);
  const [dedication, setDedication] = useState("");
  const [method, setMethod] = useState<Method>("webpay");
  const [acceptComms, setAcceptComms] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [triedExpand, setTriedExpand] = useState(false);
  const [webpaySubmitting, setWebpaySubmitting] = useState(false);
  const [webpayError, setWebpayError] = useState("");

  const nombreRef = useRef<HTMLInputElement>(null);
  const apellidosRef = useRef<HTMLInputElement>(null);
  const telefonoRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const confirmEmailRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  const customNum = custom ? parseInt(custom, 10) : null;
  const amount = customNum || selected;

  const emailMismatch = !anonimo && email.length > 0 && confirmEmail.length > 0 && email !== confirmEmail;
  const selectedMethod = METHODS.find((m) => m.id === method)!;
  const missingRequired = anonimo
    ? !amount || !acceptTerms
    : !nombre || !apellidos || !telefono || !email || !confirmEmail || !amount || !acceptTerms;
  const canSubmit = !missingRequired && !emailMismatch && selectedMethod.active;

  const digits = whatsapp.replace(/\D/g, "");
  const waText =
    "Hola, quiero ayudar a la fundación haciendo una donación, ¿Me darían los datos bancarios para transferir?" +
    (dedication.trim() ? ` (Dedicatoria: ${dedication.trim()})` : "");
  const waHref = `https://wa.me/${digits}?text=${encodeURIComponent(waText)}`;

  function goToField(el: HTMLInputElement | null) {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus({ preventScroll: true });
  }

  function focusFirstError() {
    if (!anonimo && !nombre) return goToField(nombreRef.current);
    if (!anonimo && !apellidos) return goToField(apellidosRef.current);
    if (!anonimo && !telefono) return goToField(telefonoRef.current);
    if (!anonimo && !email) return goToField(emailRef.current);
    if (!anonimo && (!confirmEmail || emailMismatch)) return goToField(confirmEmailRef.current);
    if (!amount) return;
    if (!acceptTerms) return goToField(termsRef.current);
  }

  async function handleWebpaySubmit() {
    if (!amount) return;
    setWebpayError("");
    setWebpaySubmitting(true);
    const result = await createTransbankDonationAction({
      amount,
      donorName: anonimo ? "Donante anónimo" : `${nombre} ${apellidos}`,
      donorEmail: anonimo ? ANONYMOUS_EMAIL : email,
      dedication,
    });
    if (!result.ok) {
      setWebpayError(result.message);
      setWebpaySubmitting(false);
      return;
    }
    // Webpay exige un <form method="post"> enviado al navegador, no un fetch.
    const form = document.createElement("form");
    form.method = "POST";
    form.action = result.url;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "token_ws";
    input.value = result.token;
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <div className="rounded-3xl bg-[#eef3e3] p-4 shadow-xl sm:p-6">
      <h2 className="font-heading text-base font-bold text-forest sm:text-lg">{title}</h2>

      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-forest/70">Montos sugeridos</p>
      <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {amounts.map((a) => {
          const active = selected === a && !custom;
          return (
            <button
              key={a}
              type="button"
              onClick={() => {
                setSelected(a);
                setCustom("");
              }}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                active ? "border-olive bg-olive text-white" : "border-olive/40 bg-white text-olive hover:border-olive"
              }`}
            >
              {formatCLP(a)}
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        <label htmlFor="custom-amount" className="text-xs font-semibold uppercase tracking-wide text-forest/70">
          Monto personalizado (CLP)
        </label>
        <div className="mt-1 flex items-center rounded-lg border border-border bg-white px-3.5">
          <span className="text-sm text-forest/70">$</span>
          <input
            id="custom-amount"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value.replace(/\D/g, ""));
              setSelected(null);
            }}
            placeholder="0"
            className="w-full bg-transparent px-2 py-2 text-sm text-forest outline-none"
          />
          <span className="text-xs text-forest/60">CLP</span>
        </div>
        {triedExpand && !amount && <p className="mt-1 text-xs text-red-600">Selecciona o escribe un monto.</p>}
      </div>

      {!expanded && (
        <button
          type="button"
          onClick={() => {
            if (amount) setExpanded(true);
            else setTriedExpand(true);
          }}
          className="mt-4 w-full rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#15300f]"
        >
          Donar {amount ? formatCLP(amount) : ""}
        </button>
      )}

      {expanded && (
        <div className="mt-1 animate-[fadeIn_0.25s_ease-out]">
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-forest/70">¿Quieres que tu donación sea mensual?</p>
            <div className="mt-1.5 flex gap-5">
              <label className="flex items-center gap-2 text-sm text-forest">
                <input type="radio" name="mensual" checked={mensual} onChange={() => setMensual(true)} className="accent-olive" />
                Sí <span aria-hidden="true">❤️</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-forest">
                <input type="radio" name="mensual" checked={!mensual} onChange={() => setMensual(false)} className="accent-olive" />
                No
              </label>
            </div>
          </div>

          <div className="mt-3">
            <label className="flex items-start gap-2.5 text-sm text-forest/80">
              <input
                type="checkbox"
                checked={anonimo}
                onChange={(e) => setAnonimo(e.target.checked)}
                className="mt-0.5 accent-olive"
              />
              Donación anónima (no registramos tu nombre)
            </label>
          </div>

          {!anonimo && (
            <>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="nombre" className="text-xs font-semibold uppercase tracking-wide text-forest/70">
                    Nombre *
                  </label>
                  <input
                    id="nombre"
                    ref={nombreRef}
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Juan"
                    className={`mt-1 w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-forest outline-none focus:ring-2 ${
                      triedSubmit && !nombre ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-border focus:border-olive focus:ring-olive/30"
                    }`}
                  />
                  {triedSubmit && !nombre && <p className="mt-1 text-xs text-red-600">Ingresa tu nombre.</p>}
                </div>
                <div>
                  <label htmlFor="apellidos" className="text-xs font-semibold uppercase tracking-wide text-forest/70">
                    Apellidos *
                  </label>
                  <input
                    id="apellidos"
                    ref={apellidosRef}
                    type="text"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    placeholder="Pérez"
                    className={`mt-1 w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-forest outline-none focus:ring-2 ${
                      triedSubmit && !apellidos ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-border focus:border-olive focus:ring-olive/30"
                    }`}
                  />
                  {triedSubmit && !apellidos && <p className="mt-1 text-xs text-red-600">Ingresa tus apellidos.</p>}
                </div>
              </div>

              <div className="mt-3">
                <label htmlFor="telefono" className="text-xs font-semibold uppercase tracking-wide text-forest/70">
                  Teléfono *
                </label>
                <div
                  className={`mt-1 flex items-center rounded-lg border bg-white px-3.5 focus-within:ring-2 ${
                    triedSubmit && !telefono
                      ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-200"
                      : "border-border focus-within:border-olive focus-within:ring-olive/30"
                  }`}
                >
                  <span className="text-sm text-forest/70">+56</span>
                  <input
                    id="telefono"
                    ref={telefonoRef}
                    type="text"
                    inputMode="numeric"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
                    placeholder="12345678"
                    className="w-full bg-transparent px-2 py-2 text-sm text-forest outline-none"
                  />
                </div>
                {triedSubmit && !telefono && <p className="mt-1 text-xs text-red-600">Ingresa tu teléfono.</p>}
              </div>
            </>
          )}

          {!anonimo && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-forest/70">
                  Correo electrónico *
                </label>
                <input
                  id="email"
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="donando@donando.com"
                  className={`mt-1 w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-forest outline-none focus:ring-2 ${
                    triedSubmit && !email ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-border focus:border-olive focus:ring-olive/30"
                  }`}
                />
                {triedSubmit && !email && <p className="mt-1 text-xs text-red-600">Ingresa tu correo.</p>}
              </div>
              <div>
                <label htmlFor="confirmEmail" className="text-xs font-semibold uppercase tracking-wide text-forest/70">
                  Confirmar correo electrónico *
                </label>
                <input
                  id="confirmEmail"
                  ref={confirmEmailRef}
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="donando@donando.com"
                  className={`mt-1 w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-forest outline-none focus:ring-2 ${
                    emailMismatch || (triedSubmit && !confirmEmail)
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-border focus:border-olive focus:ring-olive/30"
                  }`}
                />
                {triedSubmit && !confirmEmail && <p className="mt-1 text-xs text-red-600">Confirma tu correo.</p>}
                {emailMismatch && <p className="mt-1 text-xs text-red-600">Los correos no coinciden.</p>}
              </div>
            </div>
          )}

          <div className="mt-3">
            <label htmlFor="dedication" className="text-xs font-semibold uppercase tracking-wide text-forest/70">
              Dedicar esta donación (opcional)
            </label>
            <input
              id="dedication"
              type="text"
              value={dedication}
              onChange={(e) => setDedication(e.target.value)}
              placeholder="Ej: En memoria de..."
              maxLength={120}
              className="mt-1 w-full rounded-lg border border-border bg-white px-3.5 py-2 text-sm text-forest outline-none focus:border-olive focus:ring-2 focus:ring-olive/30"
            />
          </div>

          <p className="mt-3.5 text-xs font-semibold uppercase tracking-wide text-forest/70">Selecciona medio de pago</p>
          <div className="mt-1.5 space-y-1.5">
            {METHODS.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-center justify-between rounded-xl border px-3.5 py-2.5 transition-colors ${
                  method === m.id ? "border-olive bg-olive/5" : "border-border bg-white"
                }`}
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-forest">
                  <input
                    type="radio"
                    name="method"
                    checked={method === m.id}
                    onChange={() => setMethod(m.id)}
                    className="accent-olive"
                  />
                  <span aria-hidden="true">{m.icon}</span>
                  {m.label}
                </span>
                {m.hint && (
                  <span className={`text-xs font-semibold ${m.active ? "text-olive" : "text-forest/60"}`}>{m.hint}</span>
                )}
              </label>
            ))}
          </div>

          {method === "transferencia" && (
            <div className="mt-3 animate-[fadeIn_0.25s_ease-out] rounded-xl border border-olive/30 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-forest/70">Datos para transferir</p>
              <dl className="mt-2 space-y-1.5">
                {BANK_DETAILS.map((row) => (
                  <div key={row.label} className="flex justify-between gap-3 text-sm">
                    <dt className="text-forest/60">{row.label}</dt>
                    <dd className="text-right font-semibold text-forest">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-3 space-y-2">
            <label className="flex items-start gap-2.5 text-sm text-forest/80">
              <input
                type="checkbox"
                checked={acceptComms}
                onChange={(e) => setAcceptComms(e.target.checked)}
                className="mt-0.5 accent-olive"
              />
              Acepto recibir comunicaciones de Fundación HOCES por medios electrónicos.
            </label>
            <label className="flex items-start gap-2.5 text-sm text-forest/80">
              <input
                type="checkbox"
                ref={termsRef}
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 accent-olive"
              />
              He leído y acepto los{" "}
              <a href="/terminos" target="_blank" rel="noopener noreferrer" className="font-semibold text-olive underline">
                términos y condiciones
              </a>{" "}
              y la{" "}
              <a href="/privacidad" target="_blank" rel="noopener noreferrer" className="font-semibold text-olive underline">
                política de privacidad
              </a>
              .
            </label>
            {triedSubmit && !acceptTerms && (
              <p className="text-xs text-red-600">Debes aceptar los términos y condiciones.</p>
            )}
          </div>

          {canSubmit ? (
            method === "webpay" ? (
              <button
                type="button"
                onClick={handleWebpaySubmit}
                disabled={webpaySubmitting}
                className="mt-4 w-full rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#15300f] disabled:opacity-60"
              >
                {webpaySubmitting ? "Redirigiendo a Webpay…" : `Donar ${amount ? formatCLP(amount) : ""}`}
              </button>
            ) : (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full rounded-full bg-forest px-6 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#15300f]"
              >
                Donar {amount ? formatCLP(amount) : ""}
              </a>
            )
          ) : (
            <button
              type="button"
              onClick={() => {
                setTriedSubmit(true);
                focusFirstError();
              }}
              className="mt-4 w-full rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#15300f] disabled:opacity-60"
            >
              Donar {amount ? formatCLP(amount) : ""}
            </button>
          )}
          {webpayError && <p className="mt-2 text-xs text-red-600">{webpayError}</p>}
          {triedSubmit && !missingRequired && !emailMismatch && !selectedMethod.active && (
            <p className="mt-2 text-xs text-forest/60">
              Este medio de pago aún no está disponible. Elige &ldquo;Transferencia bancaria / WhatsApp&rdquo; para
              continuar ahora: coordinamos tu donación directamente contigo.
            </p>
          )}
        </div>
      )}
      <p className="mt-3 text-xs text-forest/70">
        Puedes donar por transferencia bancaria / WhatsApp o con tarjeta de crédito o débito (Webpay).
        Mercado Pago estará disponible próximamente.
      </p>
    </div>
  );
}
