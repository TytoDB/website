import './databaseio.css'
function DatabaseIo(){
    // Define common animation parameters

    // keyTimes: Percentage of total animation duration for each keyframe
    // 0    -> 0.1  : Initial delay @ P0 (Outer Start). Dot invisible.
    // 0.1  -> 0.15 : Fade IN @ P0. Dot visible, normal state.
    // 0.15 -> 0.45 : Travel P0 -> P_center. Visible, normal state.
    // 0.45 -> 0.55 : PAUSE @ P_center. "Charges up" - transforms to shiny/glow state.
    // 0.55 -> 0.61 : Travel P_center -> 20% of return path. Glow ON, Dot Opacity 0->1 (matches path gradient).
    // 0.61 -> 0.79 : Travel 20% -> 80% of return path. Glow ON, Dot Opacity 1 (matches path gradient).
    // 0.79 -> 0.85 : Travel 80% -> 100% of return path (P0). Glow FADES, Dot Opacity 1->0 (matches path gradient).
    // 0.85 -> 1    : Delay @ P0. Dot invisible, ready for restart.
    const animKeyTimes = "0; 0.1; 0.15; 0.45; 0.55; 0.61; 0.79; 0.85; 1";

    // motionKeyPoints: Parametric position on the animateMotion path string (0=start, 0.5=center, 1=end)
    // P0.6 = (Center=0.5) + 20% of return half (0.5 * 0.2 = 0.1) = 0.6
    // P0.9 = (Center=0.5) + 80% of return half (0.5 * 0.8 = 0.4) = 0.9
    const motionKeyPoints = "0; 0; 0; 0.5; 0.5; 0.6; 1; 1; 1";

    // Dot's own opacity, now mimics path gradient on return
    const dotOpacityValues = "0; 0; 1; 1; 0; 1; 1; 0; 0";

    // Dot's radius (for pulsing/glowing effect)
    const dotRadiusValues = "5; 5; 5; 5; 10; 10; 10; 5; 5";
    // Dot's fill color (for glowing effect)
    const dotFillValues = "#fff; #fff; #fff; #fff; #fff; #fff; #fff; #fff; #fff";

    // Glow circle's radius
    const glowRadiusValues = "0; 0; 0; 0; 25; 25; 25; 0; 0";
    // Glow circle's opacity
    const glowOpacityValues = "0; 0; 0; 0; 0.9; 0.9; 0.9; 0; 0";

    const paths = [
        { dStroke: "M 0,0 L 230,-186 Q 402.5,-186 575,-186", dAnimate: "M 575,-186 Q 402.5,-186 230,-186 L 0,0 L 230,-186 Q 402.5,-186 575,-186", dur: "4s", begin: "0s", strokeGrad: "url(#fadeStroke)" },
        { dStroke: "M 0,0 L 230,-103 Q 402.5,-103 575,-103", dAnimate: "M 575,-103 Q 402.5,-103 230,-103 L 0,0 L 230,-103 Q 402.5,-103 575,-103", dur: "4.8s", begin: "0.4s", strokeGrad: "url(#fadeStroke)" },
        { dStroke: "M 0,0 L 230,-21 Q 402.5,-21 575,-21",   dAnimate: "M 575,-21 Q 402.5,-21 230,-21 L 0,0 L 230,-21 Q 402.5,-21 575,-21",     dur: "5.6s", begin: "0.8s", strokeGrad: "url(#fadeStroke)" },
        { dStroke: "M 0,0 L 230,62 Q 402.5,62 575,62",     dAnimate: "M 575,62 Q 402.5,62 230,62 L 0,0 L 230,62 Q 402.5,62 575,62",         dur: "4.4s", begin: "1.2s", strokeGrad: "url(#fadeStroke)" },
        { dStroke: "M 0,0 L 230,144 Q 402.5,144 575,144",   dAnimate: "M 575,144 Q 402.5,144 230,144 L 0,0 L 230,144 Q 402.5,144 575,144",     dur: "5.2s", begin: "1.6s", strokeGrad: "url(#fadeStroke)" },
        // Reverse Paths
        { dStroke: "M 0,0 L -230,-186 Q -402.5,-186 -575,-186", dAnimate: "M -575,-186 Q -402.5,-186 -230,-186 L 0,0 L -230,-186 Q -402.5,-186 -575,-186", dur: "4s", begin: "0.15s", strokeGrad: "url(#fadeStrokeReverse)" },
        { dStroke: "M 0,0 L -230,-103 Q -402.5,-103 -575,-103", dAnimate: "M -575,-103 Q -402.5,-103 -230,-103 L 0,0 L -230,-103 Q -402.5,-103 -575,-103", dur: "4.8s", begin: "0.15", strokeGrad: "url(#fadeStrokeReverse)" },
        { dStroke: "M 0,0 L -230,-21 Q -402.5,-21 -575,-21",   dAnimate: "M -575,-21 Q -402.5,-21 -230,-21 L 0,0 L -230,-21 Q -402.5,-21 -575,-21",     dur: "5.6s", begin: "0.15", strokeGrad: "url(#fadeStrokeReverse)" },
        { dStroke: "M 0,0 L -230,62 Q -402.5,62 -575,62",     dAnimate: "M -575,62 Q -402.5,62 -230,62 L 0,0 L -230,62 Q -402.5,62 -575,62",         dur: "4.4s", begin: "0.15", strokeGrad: "url(#fadeStrokeReverse)" },
        { dStroke: "M 0,0 L -230,144 Q -402.5,144 -575,144",   dAnimate: "M -575,144 Q -402.5,144 -230,144 L 0,0 L -230,144 Q -402.5,144 -575,144",     dur: "4s", begin: "0.15s", strokeGrad: "url(#fadeStrokeReverse)" },
    ];

    return(
        <div id="dbio" style={{"scale":window.innerWidth/1920}}>
            <div id='box-dbio'>
                <img id='box-dbiologo' src="/logo.svg" width="100" height="100" alt="Logo" />
            </div>

            <svg width="1150" height="500" viewBox="-575 -250 1150 500" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="fadeStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ccc" stopOpacity="0" />
                        <stop offset="20%" stopColor="#ccc" stopOpacity="1" />
                        <stop offset="80%" stopColor="#ccc" stopOpacity="1" />
                        <stop offset="100%" stopColor="#ccc" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="fadeStrokeReverse" x1="1" y1="0" x2="0" y2="0">
                        <stop offset="0%" stopColor="#ccc" stopOpacity="0" />
                        <stop offset="20%" stopColor="#ccc" stopOpacity="1" />
                        <stop offset="80%" stopColor="#ccc" stopOpacity="1" />
                        <stop offset="100%" stopColor="#ccc" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow" x="-150%" y="-150%" width="400%" height="400%">
                        <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
                        <feFlood floodColor="white" floodOpacity="0.9"/> 
                        <feComposite in="coloredBlur" in2="SourceGraphic" operator="over" result="glowComposite"/>
                        <feMerge>
                            <feMergeNode in="glowComposite"/> 
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g strokeWidth="2" fill="none">
                    {paths.map((p, index) => (
                        <path key={`stroke-${index}`} stroke={p.strokeGrad} d={p.dStroke} className="dot-path" />
                    ))}
                </g>
                <g className="dot-group">
                    {paths.map((p, index) => {
                        const dur = "4s";
                        const begin = `${0.15*index}s`
                        return (
                        <g key={`dot-group-${index}`}>
                            <circle className="dot" r="5"> {/* Initial r is 5, default fill is #333 from CSS */}
                                <animateMotion
                                    dur={dur}
                                    begin={begin}
                                    repeatCount="indefinite"
                                    path={p.dAnimate}
                                    keyTimes={animKeyTimes}
                                    keyPoints={motionKeyPoints}
                                />
                                <animate
                                    attributeName="opacity"
                                    values={dotOpacityValues}
                                    keyTimes={animKeyTimes}
                                    dur={dur}
                                    begin={begin}
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="r"
                                    values={dotRadiusValues}
                                    keyTimes={animKeyTimes}
                                    dur={dur}
                                    begin={begin}
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="fill"
                                    values={dotFillValues}
                                    keyTimes={animKeyTimes}
                                    dur={dur}
                                    begin={begin}
                                    repeatCount="indefinite"
                                />
                            </circle>
                            <circle className="dot-glow" r="0" fill="white" filter="url(#glow)"> {/* Initial r is 0 */}
                                <animateMotion
                                    dur={dur}
                                    begin={begin}
                                    repeatCount="indefinite"
                                    path={p.dAnimate} 
                                    keyTimes={animKeyTimes}
                                    keyPoints={motionKeyPoints}
                                />
                                <animate
                                    attributeName="r"
                                    values={glowRadiusValues}
                                    keyTimes={animKeyTimes}
                                    dur={dur}
                                    begin={begin}
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="opacity"
                                    values={glowOpacityValues}
                                    keyTimes={animKeyTimes}
                                    dur={dur}
                                    begin={begin}
                                    repeatCount="indefinite"
                                />
                            </circle>
                        </g>
                    )})}
                </g>
            </svg>
        </div>
    )
}
export default DatabaseIo;