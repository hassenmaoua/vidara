package edu.esprit.content.enumeration;

public enum ContentType {
    IMAGE,
    VIDEO,
    TEXT,
    UNKNOWN;

    public static ContentType determineContentType(String mimeType) {
        if (mimeType == null) return UNKNOWN;
        if (mimeType.startsWith("image/")) return IMAGE;
        if (mimeType.startsWith("video/")) return VIDEO;
        return TEXT;
    }
}