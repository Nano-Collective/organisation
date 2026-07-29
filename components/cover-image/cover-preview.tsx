// Live preview frame. Mirrors the canvas output so users see exactly
// what they'll download. Pure presentational: takes a fully-resolved
// props object and renders the corresponding HTML/CSS.

import { getBackgroundStyle } from "@/lib/cover-image/background";
import { hexToRgba } from "@/lib/cover-image/color";
import { resolveFont } from "@/lib/cover-image/fonts";
import { getPatternStyle } from "@/lib/cover-image/pattern";
import { getPositionStyles } from "@/lib/cover-image/position";
import { SOCIAL_ICONS } from "@/lib/cover-image/social";
import type { PreviewProps } from "@/lib/cover-image/types";

export function CoverPreview(props: PreviewProps) {
  const {
    width,
    height,
    alignment,
    bottomPadding,
    sidePadding,
    contentGap,
    verticalCenter,
    bgStyle,
    pattern,
    colors,
    items,
    footer,
    iconsContainerRef,
  } = props;
  const iconsIndex = items.findIndex((it) => it.kind === "icons");

  return (
    <div
      className="relative overflow-hidden flex-shrink-0"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: getBackgroundStyle(bgStyle, colors),
      }}
    >
      {pattern !== "none" && (
        <div
          className="absolute inset-0 opacity-30"
          style={getPatternStyle(pattern, colors.grid)}
        />
      )}
      {bgStyle === "gradient" && (
        <>
          <div
            className="absolute rounded-full opacity-40"
            style={{
              width: "384px",
              height: "384px",
              background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
              top: "-100px",
              right: "-100px",
              filter: "blur(64px)",
            }}
          />
          <div
            className="absolute rounded-full opacity-30"
            style={{
              width: "256px",
              height: "256px",
              background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`,
              bottom: "-50px",
              left: "-50px",
              filter: "blur(64px)",
            }}
          />
        </>
      )}
      <div
        className="absolute z-10 flex flex-col"
        style={{
          gap: `${contentGap}px`,
          ...getPositionStyles(
            alignment,
            sidePadding,
            verticalCenter,
            bottomPadding,
          ),
        }}
      >
        {items.map((item, idx) => {
          if (item.kind === "text") {
            return (
              <p
                // biome-ignore lint/suspicious/noArrayIndexKey: stable per-item slot
                key={idx}
                style={{
                  fontSize: `${item.size}px`,
                  fontWeight: item.weight,
                  color: item.color,
                  fontFamily: resolveFont(item.fontFamily),
                  textTransform: item.uppercase ? "uppercase" : undefined,
                  letterSpacing: item.letterSpacing
                    ? `${item.letterSpacing}em`
                    : undefined,
                  lineHeight: 1,
                  margin: 0,
                  marginBottom: item.marginBottom
                    ? `${item.marginBottom}px`
                    : undefined,
                  whiteSpace: "pre",
                }}
              >
                {item.text}
              </p>
            );
          }
          if (item.kind === "icons") {
            return (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: stable per-item slot
                key={idx}
                ref={idx === iconsIndex ? iconsContainerRef : undefined}
                className="flex items-center"
                style={{
                  gap: `${item.gap}px`,
                  marginBottom: item.marginBottom
                    ? `${item.marginBottom}px`
                    : undefined,
                }}
              >
                {SOCIAL_ICONS.map(({ href, Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-background transition-colors"
                    style={{ color: item.color }}
                  >
                    <Icon size={item.size} />
                  </a>
                ))}
              </div>
            );
          }
          // badges — also the "CTA pill" block style, which sets a border
          // instead of a fill and carries its own font.
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: stable per-item slot
              key={idx}
              className="flex items-center"
              style={{
                gap: `${item.gap}px`,
                marginBottom: item.marginBottom
                  ? `${item.marginBottom}px`
                  : undefined,
                flexWrap: "wrap",
              }}
            >
              {item.labels.map((label, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: badge labels are positionally stable
                  key={`${idx}-${i}`}
                  style={{
                    fontSize: `${item.size}px`,
                    fontWeight: 500,
                    color: item.color,
                    fontFamily: resolveFont(item.fontFamily),
                    lineHeight: 1,
                    paddingLeft: `${item.padX}px`,
                    paddingRight: `${item.padX}px`,
                    paddingTop: `${item.padY}px`,
                    paddingBottom: `${item.padY}px`,
                    background: item.fill,
                    border: item.borderColor
                      ? `${item.borderWidth ?? 1}px solid ${item.borderColor}`
                      : undefined,
                    borderRadius: `${item.size * 0.3}px`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          );
        })}
      </div>
      {footer && (
        <div
          className="absolute z-10"
          style={{
            right: `${footer.inset}px`,
            bottom: `${footer.inset}px`,
            fontSize: `${footer.size}px`,
            fontWeight: footer.weight,
            color: footer.color,
            fontFamily: resolveFont(footer.fontFamily),
            lineHeight: 1,
            whiteSpace: "pre",
          }}
        >
          {footer.text}
        </div>
      )}
      {bgStyle === "gradient" && (
        <>
          <div
            className="absolute top-0 left-0"
            style={{
              width: "96px",
              height: "96px",
              background: `linear-gradient(to bottom right, ${hexToRgba(colors.primary, 0.2)}, transparent)`,
            }}
          />
          <div
            className="absolute bottom-0 right-0"
            style={{
              width: "96px",
              height: "96px",
              background: `linear-gradient(to top left, ${hexToRgba(colors.secondary, 0.2)}, transparent)`,
            }}
          />
        </>
      )}
    </div>
  );
}
