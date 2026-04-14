import clsx from "clsx";
import svgPaths from "./svg-8l2svuqtob";
import { imgRectangle68 } from "./svg-ihrm7";

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute h-[39px] left-[38px] overflow-clip top-[12px] w-[240px]">
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[normal] left-0 text-[17px] text-[rgba(0,0,0,0.36)] top-[8px]">{children}</p>
    </div>
  );
}

function StatusIconsPath2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute bottom-[14.29%] left-[10%] right-3/4 top-[53.57%]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 4.5">
        {children}
      </svg>
    </div>
  );
}

function StatusIconsPath1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute inset-[42.86%_52.5%_14.29%_32.5%]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 6">
        {children}
      </svg>
    </div>
  );
}

function StatusIconsPath({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute inset-[28.57%_30%_14.29%_55%]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 8">
        {children}
      </svg>
    </div>
  );
}

function TimeLightHelper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[15px] top-1/2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        {children}
      </svg>
    </div>
  );
}
type Frame27HelperProps = {
  additionalClassNames?: string;
};

function Frame27Helper({ additionalClassNames = "" }: Frame27HelperProps) {
  return (
    <div className={clsx("absolute h-0 w-[64.07px]", additionalClassNames)}>
      <div className="absolute inset-[-1px_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64.0703 1">
          <line id="Line 11" stroke="var(--stroke-0, black)" strokeOpacity="0.39" x2="64.0703" y1="0.5" y2="0.5" />
        </svg>
      </div>
    </div>
  );
}

function NotchHelper() {
  return (
    <svg fill="none" preserveAspectRatio="none" viewBox="0 0 40 30" className="absolute block size-full">
      <path d={svgPaths.p3a690980} fill="var(--fill-0, black)" id="Subtract" />
    </svg>
  );
}
type TimeLightProps = {
  className?: string;
  color?: "Green" | "Red" | "Clear" | "Blue";
};

function TimeLight({ className, color = "Red" }: TimeLightProps) {
  const isBlue = color === "Blue";
  const isClear = color === "Clear";
  const isGreen = color === "Green";
  return (
    <div className={className || `h-[21px] overflow-clip relative rounded-[20px] w-[54px] ${isClear ? "" : isBlue ? "bg-[#007aff]" : isGreen ? "bg-[#34c759]" : "bg-[#ff3b30]"}`}>
      {color === "Red" && (
        <TimeLightHelper>
          <path d={svgPaths.p12e07e20} fill="var(--fill-0, white)" id="ô¢" />
        </TimeLightHelper>
      )}
      {isGreen && (
        <TimeLightHelper>
          <path d={svgPaths.p35cccb00} fill="var(--fill-0, white)" id="ô¿" />
        </TimeLightHelper>
      )}
      {isBlue && (
        <TimeLightHelper>
          <path d={svgPaths.p2331800} fill="var(--fill-0, white)" id="ô" />
        </TimeLightHelper>
      )}
      {isClear && (
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[15px] left-[calc(50%+0.5px)] top-1/2 w-[33px]" data-name="9:41">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33 15">
            <g id="9:41">
              <g id="9:41_2">
                <path d={svgPaths.p309cf100} fill="var(--fill-0, black)" />
                <path d={svgPaths.p1285b880} fill="var(--fill-0, black)" />
                <path d={svgPaths.pa9bea00} fill="var(--fill-0, black)" />
                <path d={svgPaths.p1d3f77f0} fill="var(--fill-0, black)" />
              </g>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
type NotchProps = {
  className?: string;
  visible?: boolean;
};

function Notch({ className, visible = true }: NotchProps) {
  const isVisible = visible;
  return (
    <div className={className || isVisible ? "relative" : undefined}>
      {isVisible && (
        <>
          <div className="-translate-y-1/2 absolute h-[30px] left-[81px] top-1/2 w-[40px]" data-name="Subtract">
            <NotchHelper />
          </div>
          <div className="absolute bg-black inset-[0_121px]" />
          <div className="-translate-y-1/2 absolute flex h-[30px] items-center justify-center right-[81px] top-1/2 w-[40px]">
            <div className="-scale-y-100 flex-none rotate-180">
              <div className="h-[30px] relative w-[40px]" data-name="Subtract">
                <NotchHelper />
              </div>
            </div>
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex gap-[10px] items-center justify-center left-1/2 top-[calc(50%+0.5px)]" data-name="notch-hardware">
            <div className="bg-[rgba(0,0,0,0.01)] shrink-0 size-[13px]" data-name="spacer" />
            <div className="h-[7px] relative shrink-0 w-[48px]" data-name="speaker">
              <div className="absolute contents left-0 top-0" data-name="Mask Group">
                <div className="absolute contents left-0 top-0">
                  <div className="absolute contents left-0 top-0">
                    <div className="absolute bg-[#2a2a2a] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-px mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[2px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-px mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[2px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-px mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[2px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-px mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[2px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-px mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[2px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-px mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[2px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-px mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[2px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                  <div className="absolute contents left-[3px] top-0">
                    <div className="absolute bg-[#2a2a2a] left-[3px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-[4px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-5px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-[3px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-[4px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-5px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-[3px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-[4px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-5px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-[3px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-[4px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-5px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-[3px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-[4px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-5px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[3px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-[4px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-5px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-[3px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-[4px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-5px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                  <div className="absolute contents left-[6px] top-0">
                    <div className="absolute bg-[#2a2a2a] left-[6px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-[7px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-7px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[8px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-8px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-[6px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-[7px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-7px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[8px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-8px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-[6px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-[7px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-7px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[8px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-8px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-[6px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-[7px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-7px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[8px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-8px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-[6px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-[7px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-7px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[8px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-8px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[6px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-[7px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-7px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[8px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-8px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-[6px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-[7px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-7px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[8px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-8px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                  <div className="absolute contents left-[9px] top-0">
                    <div className="absolute bg-[#2a2a2a] left-[9px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-9px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-[10px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-10px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[11px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-11px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-[9px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-9px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-[10px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-10px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[11px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-11px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-[9px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-9px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-[10px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-10px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[11px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-11px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-[9px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-9px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-[10px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-10px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[11px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-11px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-[9px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-9px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-[10px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-10px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[11px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-11px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[9px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-9px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-[10px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-10px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[11px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-11px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-[9px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-9px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-[10px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-10px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[11px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-11px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                  <div className="absolute contents left-[12px] top-0">
                    <div className="absolute bg-[#2a2a2a] left-[12px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-12px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-[13px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-13px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[14px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-14px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-[12px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-12px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-[13px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-13px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[14px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-14px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-[12px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-12px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-[13px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-13px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[14px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-14px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-[12px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-12px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-[13px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-13px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[14px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-14px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-[12px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-12px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-[13px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-13px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[14px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-14px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[12px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-12px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-[13px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-13px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[14px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-14px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-[12px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-12px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-[13px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-13px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[14px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-14px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                  <div className="absolute contents left-[15px] top-0">
                    <div className="absolute bg-[#2a2a2a] left-[15px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-15px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-[16px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[17px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-17px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-[15px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-15px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-[16px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[17px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-17px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-[15px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-15px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-[16px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[17px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-17px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-[15px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-15px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-[16px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[17px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-17px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-[15px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-15px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-[16px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[17px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-17px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[15px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-15px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-[16px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[17px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-17px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-[15px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-15px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-[16px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[17px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-17px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                  <div className="absolute contents left-[18px] top-0">
                    <div className="absolute bg-[#2a2a2a] left-[18px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-18px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-[19px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-19px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[20px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-20px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-[18px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-18px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-[19px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-19px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[20px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-20px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-[18px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-18px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-[19px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-19px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[20px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-20px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-[18px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-18px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-[19px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-19px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[20px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-20px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-[18px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-18px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-[19px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-19px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[20px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-20px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[18px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-18px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-[19px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-19px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[20px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-20px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-[18px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-18px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-[19px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-19px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[20px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-20px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                  <div className="absolute contents left-[21px] top-0">
                    <div className="absolute bg-[#2a2a2a] left-[21px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-21px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-[22px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-22px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[23px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-23px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-[21px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-21px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-[22px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-22px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[23px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-23px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-[21px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-21px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-[22px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-22px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[23px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-23px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-[21px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-21px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-[22px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-22px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[23px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-23px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-[21px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-21px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-[22px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-22px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[23px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-23px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[21px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-21px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-[22px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-22px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[23px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-23px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-[21px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-21px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-[22px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-22px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[23px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-23px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                  <div className="absolute contents left-[24px] top-0">
                    <div className="absolute bg-[#2a2a2a] left-[24px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-24px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-[25px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-25px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[26px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-26px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-[24px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-24px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-[25px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-25px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[26px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-26px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-[24px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-24px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-[25px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-25px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[26px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-26px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-[24px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-24px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-[25px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-25px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[26px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-26px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-[24px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-24px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-[25px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-25px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[26px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-26px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[24px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-24px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-[25px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-25px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[26px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-26px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-[24px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-24px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-[25px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-25px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[26px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-26px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                  <div className="absolute contents left-[27px] top-0">
                    <div className="absolute bg-[#2a2a2a] left-[27px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-27px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-[28px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-28px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[29px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-29px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-[27px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-27px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-[28px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-28px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[29px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-29px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-[27px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-27px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-[28px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-28px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[29px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-29px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-[27px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-27px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-[28px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-28px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[29px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-29px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-[27px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-27px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-[28px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-28px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[29px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-29px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[27px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-27px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-[28px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-28px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[29px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-29px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-[27px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-27px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-[28px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-28px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[29px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-29px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                  <div className="absolute contents left-[30px] top-0">
                    <div className="absolute bg-[#2a2a2a] left-[30px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-30px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-[31px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-31px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[32px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-32px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-[30px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-30px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-[31px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-31px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[32px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-32px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-[30px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-30px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-[31px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-31px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[32px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-32px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-[30px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-30px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-[31px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-31px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[32px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-32px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-[30px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-30px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-[31px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-31px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[32px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-32px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[30px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-30px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-[31px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-31px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[32px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-32px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-[30px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-30px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-[31px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-31px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[32px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-32px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                  <div className="absolute contents left-[33px] top-0">
                    <div className="absolute bg-[#2a2a2a] left-[33px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-33px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-[34px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-34px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[35px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-35px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-[33px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-33px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-[34px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-34px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[35px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-35px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-[33px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-33px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-[34px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-34px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[35px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-35px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-[33px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-33px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-[34px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-34px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[35px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-35px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-[33px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-33px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-[34px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-34px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[35px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-35px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[33px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-33px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-[34px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-34px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[35px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-35px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-[33px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-33px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-[34px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-34px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[35px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-35px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                  <div className="absolute contents left-[36px] top-0">
                    <div className="absolute bg-[#2a2a2a] left-[36px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-36px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-[37px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-37px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[38px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-38px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-[36px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-36px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-[37px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-37px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[38px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-38px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-[36px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-36px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-[37px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-37px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[38px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-38px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-[36px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-36px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-[37px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-37px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[38px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-38px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-[36px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-36px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-[37px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-37px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[38px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-38px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[36px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-36px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-[37px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-37px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[38px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-38px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-[36px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-36px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-[37px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-37px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[38px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-38px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                  <div className="absolute contents left-[39px] top-0">
                    <div className="absolute bg-[#2a2a2a] left-[39px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-39px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-[40px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-40px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[41px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-41px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-[39px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-39px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-[40px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-40px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[41px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-41px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-[39px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-39px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-[40px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-40px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[41px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-41px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-[39px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-39px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-[40px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-40px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[41px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-41px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-[39px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-39px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-[40px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-40px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[41px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-41px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[39px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-39px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-[40px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-40px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[41px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-41px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-[39px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-39px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-[40px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-40px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[41px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-41px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                  <div className="absolute contents left-[42px] top-0">
                    <div className="absolute bg-[#2a2a2a] left-[42px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-42px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-[43px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-43px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[44px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-44px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-[42px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-42px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-[43px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-43px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[44px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-44px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-[42px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-42px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-[43px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-43px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[44px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-44px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-[42px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-42px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-[43px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-43px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[44px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-44px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-[42px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-42px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-[43px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-43px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[44px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-44px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[42px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-42px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-[43px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-43px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[44px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-44px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-[42px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-42px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-[43px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-43px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[44px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-44px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                  <div className="absolute contents left-[45px] top-0">
                    <div className="absolute bg-[#2a2a2a] left-[45px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-45px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0c0c0c] left-[46px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-46px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[47px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-47px_0px] mask-size-[48px_7px] size-px top-0" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#050505] left-[45px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-45px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#232323] left-[46px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-46px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[47px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-47px_-1px] mask-size-[48px_7px] size-px top-px" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0f0f0f] left-[45px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-45px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1c1c1c] left-[46px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-46px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#141414] left-[47px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-47px_-2px] mask-size-[48px_7px] size-px top-[2px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2b2b2b] left-[45px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-45px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#080808] left-[46px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-46px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#131313] left-[47px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-47px_-3px] mask-size-[48px_7px] size-px top-[3px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0b0b0b] left-[45px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-45px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1f1f1f] left-[46px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-46px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1a1a1a] left-[47px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-47px_-4px] mask-size-[48px_7px] size-px top-[4px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#0a0a0a] left-[45px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-45px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#202020] left-[46px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-46px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#1d1d1d] left-[47px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-47px_-5px] mask-size-[48px_7px] size-px top-[5px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#2c2c2c] left-[45px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-45px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#070707] left-[46px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-46px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                    <div className="absolute bg-[#151515] left-[47px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-47px_-6px] mask-size-[48px_7px] size-px top-[6px]" style={{ maskImage: `url('${imgRectangle68}')` }} />
                  </div>
                </div>
              </div>
              <div className="absolute border-[0.5px] border-black border-solid h-[7px] left-0 rounded-[10px] top-0 w-[48px]" />
            </div>
            <div className="relative shrink-0 size-[13px]" data-name="lens">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
                <g id="lens">
                  <circle cx="6.5" cy="6.5" fill="url(#paint0_radial_11_814)" id="Ellipse 1" r="6.5" />
                  <circle cx="6.5" cy="6.5" fill="var(--fill-0, black)" id="Ellipse 2" r="4" />
                  <g filter="url(#filter0_f_11_814)" id="Vector 1">
                    <path d={svgPaths.p13d14d00} fill="var(--fill-0, #3E89CC)" />
                  </g>
                  <g filter="url(#filter1_f_11_814)" id="Vector 2">
                    <path d={svgPaths.p31980300} fill="var(--fill-0, #3E89CC)" fillOpacity="0.79" />
                  </g>
                  <g filter="url(#filter2_f_11_814)" id="Vector 3">
                    <path d={svgPaths.p325b5e00} fill="#003C72" fillOpacity="0.79" />
                  </g>
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.06436" id="filter0_f_11_814" width="6.76534" x="5.25" y="1.1817">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feGaussianBlur result="effect1_foregroundBlur_11_814" stdDeviation="1" />
                  </filter>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="6.18029" id="filter1_f_11_814" width="4.15183" x="1.73198" y="2.31971">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feGaussianBlur result="effect1_foregroundBlur_11_814" stdDeviation="0.5" />
                  </filter>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="5.5" id="filter2_f_11_814" width="9" x="2" y="6">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feGaussianBlur result="effect1_foregroundBlur_11_814" stdDeviation="0.75" />
                  </filter>
                  <radialGradient cx="0" cy="0" gradientTransform="translate(6.5 6.5) rotate(90) scale(6.5)" gradientUnits="userSpaceOnUse" id="paint0_radial_11_814" r="1">
                    <stop offset="0.684883" stopColor="#0D0E10" />
                    <stop offset="1" stopColor="#1A1B1D" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
type BarProps = {
  className?: string;
  mode?: "Light Content" | "Dark Content";
};

function Bar({ className, mode = "Dark Content" }: BarProps) {
  return (
    <div className={className || "relative"}>
      <div className={`absolute inset-0 rounded-[10px] ${mode === "Light Content" ? "bg-white" : "bg-black"}`} data-name="Base" />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white overflow-clip relative rounded-[32px] size-full" data-name="Экран 13">
      <div className="absolute h-[32px] left-[9px] overflow-clip top-[811px] w-[375px]" data-name="iPhone-status-bar(lower)">
        <Bar className="absolute inset-[65.63%_32%_18.75%_32.27%]" />
      </div>
      <div className="absolute h-[32px] left-[9px] overflow-clip top-[811px] w-[375px]" data-name="iPhone-status-bar(lower)">
        <Bar className="absolute inset-[65.63%_32%_18.75%_32.27%]" />
      </div>
      <div className="absolute h-[310px] left-0 overflow-clip top-0 w-[393px]">
        <div className="absolute bg-[#2e2c79] h-[310px] left-0 rounded-bl-[50px] rounded-br-[50px] top-0 w-[393px]" />
        <div className="absolute h-[130px] left-0 overflow-clip text-white top-[180px] w-[393px]">
          <p className="absolute font-['Manrope:Bold',sans-serif] font-bold h-[46px] leading-[normal] left-[24px] text-[30px] top-[29px] w-[345px] whitespace-pre-wrap">Создайте свой аккаунт</p>
          <div className="-translate-x-1/2 absolute font-['Manrope:Regular',sans-serif] font-normal leading-[1.2] left-[196px] text-[14px] text-center top-[75px] tracking-[0.42px] whitespace-nowrap">
            <p className="mb-0">Мы здесь, чтобы ты достиг цели</p>
            <p>Ты готов?</p>
          </div>
        </div>
        <div className="absolute h-[69px] left-[106px] overflow-clip top-[125px] w-[181px]">
          <p className="absolute font-['Sixtyfour:Maximum',sans-serif] leading-[normal] left-[38px] text-[52px] text-white top-[9px]" style={{ fontVariationSettings: "'BLED' 0, 'SCAN' 100" }}>
            UM
          </p>
        </div>
        <div className="absolute h-[32px] left-[11px] overflow-clip top-[54px] w-[100px]">
          <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[normal] left-[28px] text-[12px] text-white top-[8px]">Назад</p>
          <div className="absolute h-[9.5px] left-[13px] top-[12.5px] w-[8.001px]" data-name="icon">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.00085 9.50043">
              <path d={svgPaths.pc75d172} fill="var(--fill-0, #D9D9D9)" id="icon" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute h-[44px] left-[8px] overflow-clip right-[10px] top-[8px]" data-name="iPhone-status-bar(upper)">
        <Notch className="absolute h-[30px] left-0 right-0 top-0" visible={false} />
        <div className="absolute content-stretch flex gap-[4px] items-center right-[14px] top-[16px]" data-name="Status Icons">
          <div className="h-[14px] relative shrink-0 w-[20px]" data-name="Network Signal / Light">
            <StatusIconsPath>
              <path clipRule="evenodd" d={svgPaths.p383d5700} fill="var(--fill-0, #F9F9F9)" fillRule="evenodd" id="Path" />
            </StatusIconsPath>
            <StatusIconsPath1>
              <path clipRule="evenodd" d={svgPaths.p28546400} fill="var(--fill-0, #F9F9F9)" fillRule="evenodd" id="Path" />
            </StatusIconsPath1>
            <StatusIconsPath2>
              <path clipRule="evenodd" d={svgPaths.p129e3f40} fill="var(--fill-0, #F9F9F9)" fillRule="evenodd" id="Path" />
            </StatusIconsPath2>
            <div className="absolute inset-[14.29%_7.5%_14.29%_77.5%]" data-name="Empty Bar">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 10">
                <path clipRule="evenodd" d={svgPaths.p3636b500} fill="var(--fill-0, #3C3C43)" fillOpacity="0.18" fillRule="evenodd" id="Empty Bar" />
              </svg>
            </div>
            <StatusIconsPath>
              <path clipRule="evenodd" d={svgPaths.p383d5700} fill="var(--fill-0, black)" fillRule="evenodd" id="Path" />
            </StatusIconsPath>
            <StatusIconsPath1>
              <path clipRule="evenodd" d={svgPaths.p28546400} fill="var(--fill-0, black)" fillRule="evenodd" id="Path" />
            </StatusIconsPath1>
            <StatusIconsPath2>
              <path clipRule="evenodd" d={svgPaths.p129e3f40} fill="var(--fill-0, black)" fillRule="evenodd" id="Path" />
            </StatusIconsPath2>
          </div>
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="WiFi Signal / Light">
            <div className="absolute inset-[63.85%_35.56%_14.29%_37.11%]" data-name="Path">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.37186 3.06041">
                <path d={svgPaths.p1da632f0} fill="var(--fill-0, black)" id="Path" />
              </svg>
            </div>
            <div className="absolute inset-[39.07%_20.1%_37.26%_21.66%]" data-name="Path">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.3198 3.31425">
                <path d={svgPaths.p2307b100} fill="var(--fill-0, black)" id="Path" />
              </svg>
            </div>
            <div className="absolute inset-[14.29%_4.69%_54.84%_6.25%]" data-name="Path">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.25 4.32259">
                <path d={svgPaths.p392f1a00} fill="var(--fill-0, black)" id="Path" />
              </svg>
            </div>
          </div>
          <div className="h-[14px] relative shrink-0 w-[25px]" data-name="Battery / Light">
            <div className="absolute h-[4px] left-[24px] top-[5px] w-px">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 4">
                <path d={svgPaths.p16442180} fill="var(--fill-0, #3C3C43)" fillOpacity="0.6" id="Rectangle 23" />
              </svg>
            </div>
            <div className="absolute h-[12px] left-0 top-px w-[23px]" data-name="Rectangle 21 (Stroke)">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 12">
                <path clipRule="evenodd" d={svgPaths.p48c4400} fill="var(--fill-0, #3C3C43)" fillOpacity="0.6" fillRule="evenodd" id="Rectangle 21 (Stroke)" />
              </svg>
            </div>
            <div className="-translate-y-1/2 absolute bg-black h-[8px] left-[2px] rounded-[1px] top-1/2 w-[19px]" />
          </div>
        </div>
        <div className="absolute right-[71px] size-[6px] top-[8px]">
          {["Camera", "Microphone"].includes("None") && (
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
              <circle cx="3" cy="3" fill={"None" === "Microphone" ? "var(--fill-0, #FF9500)" : "var(--fill-0, #34C759)"} id="Indicator" r="3" />
            </svg>
          )}
        </div>
        <TimeLight className="absolute h-[21px] left-[21px] overflow-clip rounded-[20px] top-[12px] w-[54px]" color="Clear" />
      </div>
      <div className="absolute h-[352px] left-0 overflow-clip top-[310px] w-[393px]">
        <div className="absolute h-[63px] left-0 overflow-clip top-[32px] w-[393px]">
          <div className="absolute border-2 border-[#3430b5] border-solid h-[50px] left-[23px] rounded-[15px] top-[6px] w-[288px]" />
          <Wrapper>{`Enter  first name`}</Wrapper>
        </div>
        <div className="absolute h-[63px] left-0 overflow-clip top-[95px] w-[393px]">
          <div className="absolute border-2 border-[#3430b5] border-solid h-[50px] left-[23px] rounded-[15px] top-[6px] w-[288px]" />
          <Wrapper>{`Enter  last name`}</Wrapper>
        </div>
        <div className="absolute h-[63px] left-0 overflow-clip top-[158px] w-[393px]">
          <div className="absolute border-2 border-[#3430b5] border-solid h-[50px] left-[23px] rounded-[15px] top-[6px] w-[288px]" />
          <Wrapper>{`Enter  email`}</Wrapper>
        </div>
        <div className="absolute h-[63px] left-0 overflow-clip top-[221px] w-[393px]">
          <div className="absolute border-2 border-[#3430b5] border-solid h-[50px] left-[23px] rounded-[15px] top-[6px] w-[288px]" />
          <Wrapper>{`Enter  password`}</Wrapper>
        </div>
      </div>
      <div className="absolute h-[63px] left-[85px] overflow-clip top-[608px] w-[223px]">
        <div className="absolute bg-gradient-to-r from-[#17154f] h-[47px] left-[36px] rounded-[100px] to-[#3f3c9f] top-[7px] w-[151px]" />
        <p className="absolute font-['Manrope:Medium',sans-serif] font-medium leading-[normal] left-[83px] text-[17px] text-white top-[19px]">начать</p>
      </div>
      <div className="absolute h-[170px] left-0 overflow-clip top-[662px] w-[393px]">
        <div className="absolute h-[41px] left-0 overflow-clip top-[31px] w-[393px]">
          <p className="absolute font-['Manrope:Medium',sans-serif] font-medium leading-[normal] left-[118px] text-[12px] text-[rgba(0,0,0,0.62)] top-[15px]">{`зарегистрироваться через `}</p>
          <Frame27Helper additionalClassNames="left-[281.96px] top-[26.5px]" />
          <Frame27Helper additionalClassNames="left-[44px] top-[27px]" />
        </div>
        <div className="absolute h-[46px] left-[63px] overflow-clip top-[67px] w-[267px]">
          <div className="absolute h-[46px] left-[109px] top-0 w-[48px]" data-name="Google">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 46">
              <g id="Google">
                <path d={svgPaths.p2045080} fill="var(--fill-0, white)" id="back" />
                <g id="super-g">
                  <path d={svgPaths.p1ed6f200} fill="var(--fill-0, #EA4335)" id="Shape" />
                  <path d={svgPaths.p30e54900} fill="var(--fill-0, #4285F4)" id="Shape_2" />
                  <path d={svgPaths.p3d713700} fill="var(--fill-0, #FBBC05)" id="Shape_3" />
                  <path d={svgPaths.p3b4c8f00} fill="var(--fill-0, #34A853)" id="Shape_4" />
                  <g id="Shape_5" />
                </g>
              </g>
            </svg>
          </div>
          <div className="absolute h-[30px] left-[62px] top-[8px] w-[32px]" data-name="Apple">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 30">
              <path clipRule="evenodd" d={svgPaths.p2e6fba00} fill="var(--fill-0, black)" fillRule="evenodd" id="Combined-Shape" />
            </svg>
          </div>
          <div className="absolute h-[46px] left-[163px] top-0 w-[47px]" data-name="Facebook">
            <div className="absolute inset-[19.57%_19.15%_19.57%_17.02%]" data-name="Facebook">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 28">
                <g id="Facebook">
                  <path d={svgPaths.p28abb800} fill="var(--fill-0, #1877F2)" id="Path" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className="absolute h-[23px] left-[107px] overflow-clip top-[137px] w-[179px]">
          <p className="absolute font-['Manrope:Medium',sans-serif] font-medium leading-[normal] left-[18px] text-[12px] text-[rgba(0,0,0,0.52)] top-[3px]">уже есть аккаунт? Войти</p>
        </div>
      </div>
    </div>
  );
}