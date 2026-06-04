import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Black Corporativo - Boutique Inmobiliaria de Alta Gama";
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
                    fontFamily: "Inter, sans-serif",
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
                            fontSize: "64px",
                            fontWeight: "bold",
                            color: "#FAFAFA",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        BLACK <span style={{ color: "#D4AF37" }}>CORP</span>
                    </div>
                    <div
                        style={{
                            fontSize: "24px",
                            color: "#A1A1AA",
                            textAlign: "center",
                        }}
                    >
                        Boutique Inmobiliaria de Alta Gama
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
                                    border: "1px solid #D4AF37",
                                    borderRadius: "8px",
                                    color: "#D4AF37",
                                    fontSize: "18px",
                                    fontWeight: "500",
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
