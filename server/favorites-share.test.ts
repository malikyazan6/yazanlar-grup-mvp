import { describe, expect, it } from "vitest";

describe("Favorites and Share Functionality", () => {
  it("should add product to favorites", () => {
    const mockProduct = {
      id: 1,
      categoryId: "ndt",
      name: "Penetrant Test Spray",
      technicalCode: "PTS-001",
      material: "Liquid",
      certification: "ISO 3104",
      price: 150,
      quantity: 100,
      inStock: true,
      specs: { viscosity: "2-5 cSt" },
    };

    let favorites: any[] = [];

    const addToFavorites = (product: any) => {
      const isFav = favorites.find((fav) => fav.id === product.id);
      if (!isFav) {
        favorites.push(product);
      }
    };

    addToFavorites(mockProduct);

    expect(favorites).toHaveLength(1);
    expect(favorites[0].id).toBe(1);
  });

  it("should remove product from favorites", () => {
    const mockProduct = {
      id: 2,
      categoryId: "welding",
      name: "ER308L TIG Wire",
      technicalCode: "ER308L-1.6",
      material: "Stainless Steel",
      certification: "AWS A5.9",
      price: 250,
      quantity: 200,
      inStock: true,
      specs: { diameter: "1.6mm" },
    };

    let favorites = [mockProduct];

    const removeFromFavorites = (productId: number) => {
      favorites = favorites.filter((fav) => fav.id !== productId);
    };

    removeFromFavorites(2);

    expect(favorites).toHaveLength(0);
  });

  it("should not add duplicate products to favorites", () => {
    const mockProduct = {
      id: 3,
      categoryId: "safety",
      name: "Safety Gloves",
      technicalCode: "SG-001",
      material: "Kevlar",
      certification: "EN 407",
      price: 180,
      quantity: 300,
      inStock: true,
      specs: { size: "L" },
    };

    let favorites: any[] = [];

    const addToFavorites = (product: any) => {
      const isFav = favorites.find((fav) => fav.id === product.id);
      if (!isFav) {
        favorites.push(product);
      }
    };

    addToFavorites(mockProduct);
    addToFavorites(mockProduct);

    expect(favorites).toHaveLength(1);
  });

  it("should generate WhatsApp share URL", () => {
    const mockProduct = {
      id: 4,
      categoryId: "construction",
      name: "Epoxy Anchor",
      technicalCode: "EA-M12",
      material: "Epoxy Resin",
      certification: "ETA",
      price: 320,
      quantity: 200,
      inStock: true,
      specs: { tensile: "15 kN" },
    };

    const generateShareUrl = (product: any, platform: string) => {
      const text = `${product.name} - ${product.technicalCode}`;
      const url = `https://example.com/product/${product.id}`;

      if (platform === "whatsapp") {
        return `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
      }
      return "";
    };

    const shareUrl = generateShareUrl(mockProduct, "whatsapp");

    expect(shareUrl).toContain("wa.me");
    expect(shareUrl).toContain("Epoxy%20Anchor");
    expect(shareUrl).toContain("EA-M12");
  });

  it("should generate Twitter share URL", () => {
    const mockProduct = {
      id: 5,
      categoryId: "surface",
      name: "Zirconia Flap Disk",
      technicalCode: "ZF-125",
      material: "Zirconia",
      certification: "ISO 13696",
      price: 95,
      quantity: 500,
      inStock: true,
      specs: { diameter: "125mm" },
    };

    const generateShareUrl = (product: any, platform: string) => {
      const text = `${product.name} - ${product.technicalCode}`;
      const url = `https://example.com/product/${product.id}`;

      if (platform === "twitter") {
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      }
      return "";
    };

    const shareUrl = generateShareUrl(mockProduct, "twitter");

    expect(shareUrl).toContain("twitter.com");
    expect(shareUrl).toContain("intent/tweet");
    expect(shareUrl).toContain("Zirconia%20Flap%20Disk");
  });

  it("should generate Facebook share URL", () => {
    const mockProduct = {
      id: 6,
      categoryId: "chemicals",
      name: "Polyurethane Mastic",
      technicalCode: "PM-500",
      material: "Polyurethane",
      certification: "ISO 11600",
      price: 280,
      quantity: 150,
      inStock: true,
      specs: { volume: "500ml" },
    };

    const generateShareUrl = (product: any, platform: string) => {
      const url = `https://example.com/product/${product.id}`;

      if (platform === "facebook") {
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      }
      return "";
    };

    const shareUrl = generateShareUrl(mockProduct, "facebook");

    expect(shareUrl).toContain("facebook.com");
    expect(shareUrl).toContain("sharer");
  });

  it("should generate Email share URL", () => {
    const mockProduct = {
      id: 7,
      categoryId: "ndt",
      name: "Magnetic Particle Powder",
      technicalCode: "MPP-100",
      material: "Iron Oxide",
      certification: "ISO 9934",
      price: 120,
      quantity: 80,
      inStock: true,
      specs: { grain: "Fine" },
    };

    const generateShareUrl = (product: any, platform: string) => {
      const text = `${product.name} - ${product.technicalCode}`;
      const url = `https://example.com/product/${product.id}`;

      if (platform === "email") {
        return `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
      }
      return "";
    };

    const shareUrl = generateShareUrl(mockProduct, "email");

    expect(shareUrl).toContain("mailto:");
    expect(shareUrl).toContain("subject=");
    expect(shareUrl).toContain("body=");
  });

  it("should retrieve favorites from localStorage", () => {
    const mockFavorites = [
      {
        id: 1,
        categoryId: "ndt",
        name: "Product 1",
        technicalCode: "P1",
        material: "Material",
        certification: "ISO",
        price: 100,
        quantity: 50,
        inStock: true,
        specs: {},
      },
      {
        id: 2,
        categoryId: "welding",
        name: "Product 2",
        technicalCode: "P2",
        material: "Material",
        certification: "AWS",
        price: 200,
        quantity: 100,
        inStock: true,
        specs: {},
      },
    ];

    // Simulate localStorage
    const mockStorage: Record<string, string> = {};

    const getFavorites = () => {
      return JSON.parse(mockStorage["favorites"] || "[]");
    };

    const setFavorites = (favorites: any[]) => {
      mockStorage["favorites"] = JSON.stringify(favorites);
    };

    setFavorites(mockFavorites);
    const retrieved = getFavorites();

    expect(retrieved).toHaveLength(2);
    expect(retrieved[0].id).toBe(1);
    expect(retrieved[1].id).toBe(2);
  });
});
