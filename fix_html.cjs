const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `            </div>
        </section>
</div>

                <div class="hidden flex-row gap-1 h-full w-full overflow-x-auto" id="mixerPanel">
                    <!-- 12 mixer channels injected here -->
                </div>

</section>

    </main>`;

const replacementStr = `            </div>
            
            <div class="hidden flex-row gap-2 h-full w-full overflow-x-auto pb-2" id="mixerPanel">
                <!-- 12 mixer channels injected here -->
            </div>
            
        </div>
    </section>

    </main>`;

if (html.includes(targetStr)) {
    html = html.replace(targetStr, replacementStr);
    fs.writeFileSync('index.html', html);
    console.log("Fixed HTML layout");
} else {
    console.log("Could not find target string");
}
