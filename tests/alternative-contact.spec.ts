import { expect, test, type Page } from "@playwright/test";

const propertyId = "11111111-1111-4111-8111-111111111111";

async function fillContact(page: Page) {
  await page.getByLabel("Nombre completo").fill("Persona de prueba");
  await page.getByLabel("Correo electrónico").fill("prueba@example.com");
  await page.getByRole("checkbox").check();
}

// All submissions are intercepted: these tests must never create database leads.
test.beforeEach(async ({ page }) => {
  await page.route("**/api/public-leads", (route) => route.fulfill({ status: 503, json: { error: "Servicio no disponible" } }));
});

test("contacto conserva inmueble, segmento y servicio al enviar", async ({ page }) => {
  let payload: Record<string, unknown> = {};
  await page.route("**/api/public-leads", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 201, json: { success: true } });
  });
  await page.goto(`/contacto?property=casa-prueba&property_id=${propertyId}&title=Casa%20de%20prueba&brand=luxury&servicio=opinion-de-valor&objetivo=vender`);
  await expect(page.getByText("Casa de prueba", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Interés principal")).toHaveValue("Saber cuánto puede valer");
  await fillContact(page);
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Solicitud registrada" })).toBeVisible();
  expect(payload.property_id).toBe(propertyId);
  expect(payload.source).toBe("landing_luxury");
  expect(payload.notes).toContain("Casa de prueba");
  expect(payload.notes).toContain("opinion-de-valor");
  expect(payload.notes).toContain("vender");
});

test("quitar inmueble elimina su asociación sin borrar lo escrito", async ({ page }) => {
  let payload: Record<string, unknown> = {};
  await page.route("**/api/public-leads", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 201, json: { success: true } });
  });
  await page.goto(`/contacto?property_id=${propertyId}&title=Casa%20de%20prueba&objetivo=rentar`);
  await fillContact(page);
  await page.getByRole("button", { name: "Quitar inmueble" }).click();
  await expect(page.getByLabel("Nombre completo")).toHaveValue("Persona de prueba");
  await expect(page.getByLabel("Interés principal")).toHaveValue("Rentar");
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.getByText("Solicitud registrada", { exact: true })).toBeVisible();
  expect(payload.property_id).toBeUndefined();
  expect(payload.notes).not.toContain("Casa de prueba");
});

test("error de servidor conserva datos y permite reintentar", async ({ page }) => {
  await page.goto("/contacto?brand=business");
  await fillContact(page);
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.getByRole("form", { name: "Solicitud de contacto" }).getByRole("alert")).toContainText("Tus datos se conservan");
  await expect(page.getByLabel("Correo electrónico")).toHaveValue("prueba@example.com");
  await page.route("**/api/public-leads", (route) => route.fulfill({ status: 201, json: { success: true } }));
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.getByText("Solicitud registrada", { exact: true })).toBeVisible();
});

test("propietarios selecciona renta y captura información inicial sin archivos", async ({ page }) => {
  let payload: Record<string, unknown> = {};
  await page.route("**/api/public-leads", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 201, json: { success: true } });
  });
  await page.goto("/propietarios");
  await expect(page.getByRole("heading", { name: "Vende o renta tu inmueble con una estrategia definida." })).toBeVisible();
  await page.getByRole("button", { name: "Poner en renta", exact: true }).click();
  await expect(page.getByLabel("Objetivo")).toHaveValue("Poner en renta");
  await page.getByLabel("Tipo de inmueble").selectOption("Casa");
  await page.getByLabel("Zona o colonia").fill("Zona Río");
  await fillContact(page);
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Solicitar orientación" }).click();
  await expect(page.getByText("Solicitud registrada", { exact: true })).toBeVisible();
  expect(payload.notes).toContain("Poner en renta");
  expect(payload.notes).toContain("Casa");
  expect(payload.notes).toContain("Zona Río");
});

test("enlace de ficha conserva visita e ignora identificadores inválidos", async ({ page }) => {
  let payload: Record<string, unknown> = {};
  await page.route("**/api/public-leads", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 201, json: { success: true } });
  });
  await page.goto("/contacto?property_id=no-es-uuid&propiedad=Nave%20de%20prueba&objetivo=solicitar-visita&brand=industrial");
  await expect(page.getByText("Nave de prueba", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Interés principal")).toHaveValue("Solicitar una visita");
  await expect(page.locator('input[name="property_id"]')).toHaveCount(0);
  await fillContact(page);
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.getByText("Solicitud registrada", { exact: true })).toBeVisible();
  expect(payload.property_id).toBeUndefined();
  expect(payload.source).toBe("landing_industrial");
  expect(payload.notes).toContain("Nave de prueba");
});

test("asesoría conserva calculadora y valida teléfono antes de enviar", async ({ page }) => {
  let sent = 0;
  let payload: Record<string, unknown> = {};
  await page.route("**/api/public-leads", async (route) => {
    sent += 1;
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 201, json: { success: true } });
  });
  await page.goto("/contacto?objetivo=asesoria&interes=herramientas&calculadora=roi");
  await expect(page.getByLabel("Interés principal")).toHaveValue("Asesoría");
  await fillContact(page);
  await page.getByLabel("WhatsApp o teléfono", { exact: true }).fill("123");
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.getByRole("form").getByRole("alert")).toContainText("10 dígitos");
  expect(sent).toBe(0);
  await page.getByLabel("WhatsApp o teléfono", { exact: true }).fill("6641234567");
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.getByText("Solicitud registrada", { exact: true })).toBeVisible();
  expect(payload.notes).toContain("calculadora: roi");
});

test("contacto y propietarios se adaptan al móvil sin desbordamiento", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/contacto", "/propietarios?objetivo=rentar"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole("form")).toBeVisible();
  }
  await expect(page.getByLabel("Objetivo")).toHaveValue("Poner en renta");
});
