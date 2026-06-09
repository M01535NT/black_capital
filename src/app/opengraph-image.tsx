import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Black Capital - Inmobiliaria Premium en Tijuana";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Manrope, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "24px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "clamp(2.75rem, 6vw, 5.75rem)",
                            fontWeight: "bold",
                            color: "#FAFAFA",
                            letterSpacing: "-0.02em",
                            textTransform: "uppercase",
                            wordSpacing: "0.08em",
                            lineHeight: "0.94",
                        }}
                    >
                        BLACK <span style={{ color: "#CFB155" }}>CORP</span>
                    </div>
                    <div
                        style={{
                            fontSize: "clamp(1.05rem, 1.6vw, 1.375rem)",
                            color: "#A1A1AA",
                            textAlign: "center",
                            fontWeight: 500,
                            letterSpacing: "-0.005em",
                            lineHeight: "1.45",
                            maxWidth: "62ch",
                        }}
                    >
                        Plataforma Inmobiliaria de Alta Gama
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: "32px",
                            marginTop: "32px",
                        }}
                    >
                        {["Luxury", "Business", "Industrial"].map((brand) => (
                            <div
                                key={brand}
                                style={{
                                    padding: "12px 24px",
                                    border: "1px solid #CFB155",
                                    borderRadius: "8px",
                                    color: "#CFB155",
                                    fontSize: "0.95rem",
                                    fontWeight: "500",
                                    letterSpacing: "0.02em",
                                    lineHeight: "1.5",
                                    fontFamily:
                                        "Manrope, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                }}
                            >
                                {brand}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
